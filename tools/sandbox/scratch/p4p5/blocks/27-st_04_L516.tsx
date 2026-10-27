function Page({ color }: { color: string }) {
  const Title = styled.h1`color: ${color};`;   // ❌ new component type on every render
  return <Title>Hello</Title>;                  // → React sees a different type each render → unmount/remount
}
export {};
