// src/app/RouteErrorBoundary.tsx
import { isRouteErrorResponse, useNavigate, useRevalidator, useRouteError } from "react-router";
import { HttpError } from "../shared/http/httpError";

export function RouteErrorBoundary() {
  const error = useRouteError();
  const revalidator = useRevalidator();
  const navigate = useNavigate();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div role="alert">
        <h1>Not found</h1>
        <p>We could not find that page or record.</p>
        <button type="button" onClick={() => navigate("/")}>Go to overview</button>
      </div>
    );
  }

  if (error instanceof HttpError) {
    if (error.kind === "aborted") return null; // superseded navigation: not an error to the user
    const retryable = error.kind === "network" || error.kind === "server";
    return (
      <div role="alert">
        <h1>{error.kind === "network" ? "You appear to be offline" : "Something went wrong"}</h1>
        {retryable && (
          <button type="button" onClick={() => revalidator.revalidate()}>Try again</button>
        )}
      </div>
    );
  }

  console.error(error); // unexpected: log and show generic fallback
  return <div role="alert"><h1>Unexpected error</h1></div>;
}
