export {};
// Safe (widens input):
function format(x: number): string          // v1
function format(x: number | bigint): string // v2

// Breaking (widens output): callers assumed string
function getLabel(): string                  // v1
function getLabel(): string | undefined      // v2

// Callback props: the library CALLS the consumer's function.
interface Props { onSelect: (id: string) => void }              // v1
interface Props { onSelect: (id: string, meta: Meta) => void }  // v2
// A consumer's `(id: string) => void` is still assignable to v2's type,
// because a function that accepts fewer parameters can stand in for one that
// is called with more. So adding a trailing argument to a callback you invoke
// is source-compatible. Removing an argument the consumer reads is breaking.
