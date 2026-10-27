function UserForm({ user }: { user: User }) {
  // Draft is initialised once per `user.id`; the parent keys this component by id.
  const [draft, setDraft] = useState({ name: user.name });
  const dirty = draft.name !== user.name;      // derived, not stored
  // submit → mutation; on success the server cache updates `user` and `dirty` becomes false
  // ...
}

// parent
<UserForm key={user.id} user={user} />
export {};
