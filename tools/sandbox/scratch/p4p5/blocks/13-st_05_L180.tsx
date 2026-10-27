// INCORRECT (illustrative): four independent facts
function SaveButton({ save }: { save: () => Promise<void> }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    try {
      await save();
      setIsSuccess(true);          // forgot: setIsError(false) from a previous failure
    } catch {
      setIsError(true);            // forgot: setIsSuccess(false)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button onClick={handleClick} disabled={isLoading}>Save</button>
      {isLoading && <Spinner />}
      {isSuccess && <p>Saved</p>}
      {isError && <p role="alert">Failed</p>}
    </>
  );
}
export {};
