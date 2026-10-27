import { noop } from "./utils.js";
import { asyncThrottle } from "./asyncThrottle.js";
//#region src/index.ts
/**
* Creates a persister that saves the client to an asynchronous storage such as `AsyncStorage`,
* throttled by `throttleTime`. If saving fails, `retry` can return a smaller client to try again.
* @param options - The `storage` to persist to, the `key`, `throttleTime`, `serialize`,
* `deserialize`, and `retry` options.
* @returns A persister that saves, restores, and removes the client in `storage`. Without
* `storage`, its methods do nothing.
*/
const createAsyncStoragePersister = ({ storage, key = `REACT_QUERY_OFFLINE_CACHE`, throttleTime = 1e3, serialize = JSON.stringify, deserialize = JSON.parse, retry }) => {
	if (storage) {
		const trySave = async (persistedClient) => {
			try {
				const serialized = await serialize(persistedClient);
				await storage.setItem(key, serialized);
				return;
			} catch (error) {
				return error;
			}
		};
		return {
			persistClient: asyncThrottle(async (persistedClient) => {
				let client = persistedClient;
				let error = await trySave(client);
				let errorCount = 0;
				while (error && client) {
					errorCount++;
					client = await (retry === null || retry === void 0 ? void 0 : retry({
						persistedClient: client,
						error,
						errorCount
					}));
					if (client) error = await trySave(client);
				}
			}, { interval: throttleTime }),
			restoreClient: async () => {
				const cacheString = await storage.getItem(key);
				if (!cacheString) return;
				return await deserialize(cacheString);
			},
			removeClient: () => storage.removeItem(key)
		};
	}
	return {
		persistClient: noop,
		restoreClient: () => Promise.resolve(void 0),
		removeClient: noop
	};
};
//#endregion
export { createAsyncStoragePersister };

//# sourceMappingURL=index.js.map