// Read: remember the version
const res = await fetch(`/api/jobs/42`);
const etag = res.headers.get('ETag'); // e.g. '"v17"'

// Write: only succeed if unchanged
const put = await fetch(`/api/jobs/42`, {
  method: 'PUT',
  headers: { 'If-Match': etag ?? '', 'Content-Type': 'application/json' },
  body: JSON.stringify(edited),
});
if (put.status === 412) {
  // Precondition Failed: someone else changed it. Fetch the latest and let the user merge.
}
export {};
