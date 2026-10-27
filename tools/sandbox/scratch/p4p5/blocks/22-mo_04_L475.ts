import { createHttpClient } from "@acme/api-client";
import { createCardsApi } from "@acme/api-client/cards";
import { tokenStore } from "./auth/token-store";

const http = createHttpClient({ baseUrl: import.meta.env.VITE_API_URL, getToken: () => tokenStore.get() });
export const cardsApi = createCardsApi(http);
export {};
