<Mouse render={(pos) => <Cursor x={pos.x} y={pos.y} />} />       // a prop named `render`
<Mouse>{(pos) => <Cursor x={pos.x} y={pos.y} />}</Mouse>        // `children` used as the function
<List items={rows} renderItem={(row) => <RowView row={row} />} /> // domain-specific names
export {};
