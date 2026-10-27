const orders = (await (await fetch("/api/orders")).json()) as Order[];
export {};
