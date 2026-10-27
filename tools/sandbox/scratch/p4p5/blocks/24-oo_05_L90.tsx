const [cart] = useState(() => new Cart());     // class with add(item) mutating items
cart.add(item);                                  // mutates, no re-render
export {};
