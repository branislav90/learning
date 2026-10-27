export {};
// usage: isolate a risky subtree so a failure does not blank the whole page
<RouteErrorBoundary
  resetKey={location.pathname}
  fallback={(reset) => (
    <section role="alert">
      <h2>We couldn't load the payment step</h2>
      <p>Your cart is saved. You can try again, or continue with another payment method.</p>
      <button onClick={reset}>Try again</button>
    </section>
  )}
>
  <PaymentStep />
</RouteErrorBoundary>
