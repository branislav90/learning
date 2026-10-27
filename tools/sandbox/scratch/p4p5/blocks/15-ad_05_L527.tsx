// checkout/PayButton.tsx — the UI sees only the interface
export function PayButton({ order, country }: { order: Order; country: string }) {
  const [state, setState] = useState<'idle' | 'paying' | PaymentResult>('idle');

  async function onClick() {
    setState('paying');
    const gateway = getGateway(chooseGatewayId(country));
    const result = await gateway.pay({
      amountMinor: order.totalMinor, currency: order.currency, orderId: order.id,
    });
    setState(result);
  }
  // render by state ...
}
export {};
