<input value={name} />            // stuck: typing reverts; React warns (add onChange or readOnly)
<input value={user.nickname} />   // nickname: string | null → null triggers a warning; coerce: value={user.nickname ?? ""}
export {};
