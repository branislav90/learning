// Looks presentational, but is not
export function PriceLabel({ productId }: { productId: string }) {
  const { currency } = useSettings();            // ambient dependency #1
  const { data } = useQuery(["price", productId], () => fetchPrice(productId)); // #2
  const navigate = useNavigate();                // #3
  return <span onClick={() => navigate(`/p/${productId}`)}>{format(data, currency)}</span>;
}
export {};
