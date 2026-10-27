<Select
  options={options}
  value={value}
  onChange={setValue}
  variant="outline" size="sm" searchable multiple clearable
  placeholder="Pick one"
  renderOption={(o) => <Flag code={o.code} />}
  renderValue={(v) => …}
  classNames={{ trigger: "…", list: "…", option: "…", search: "…" }}
  menuPlacement="bottom-start" maxMenuHeight={320} virtualised
  isOptionDisabled={(o) => o.archived}
  onOpen={…} onClose={…} onSearchChange={…}
/>
export {};
