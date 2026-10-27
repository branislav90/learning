function PricingToggle({ onChange }: { onChange: (p: "monthly" | "yearly") => void }) {
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  return (
    <div className="inline-flex rounded-full bg-gray-100 p-1">
      <button className={period === "monthly" ? "bg-white shadow rounded-full px-4" : "px-4"}
              onClick={() => { setPeriod("monthly"); onChange("monthly"); }}>Monthly</button>
      <button className={period === "yearly" ? "bg-white shadow rounded-full px-4" : "px-4"}
              onClick={() => { setPeriod("yearly"); onChange("yearly"); }}>Yearly</button>
    </div>
  );
}
export {};
