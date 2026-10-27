{Children.map(children, (child, index) => cloneElement(child as ReactElement<{ index: number }>, { index }))}
export {};
