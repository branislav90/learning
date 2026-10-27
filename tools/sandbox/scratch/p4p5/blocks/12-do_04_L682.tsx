const [open, setOpen] = useState(false);
const late = daysBetween(invoice.dueDate, today) > 0 && !invoice.paid;
const label = late ? t("invoice.overdue") : t("invoice.ok");
await api.post(`/invoices/${id}/remind`);
queryClient.invalidateQueries({ queryKey: ["invoices"] });
export {};
