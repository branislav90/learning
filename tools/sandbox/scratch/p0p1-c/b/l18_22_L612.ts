export {};
type Animal = { kind: "cat"; meow(): void } | { kind: "dog"; bark(): void };
function speak(a: Animal) {
  a.meow();
}
