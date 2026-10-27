export {};
const user = { id: 1, name: "Ada" };
const id = pick(user, "id");     // number
// pick(user, "email");          // error: not assignable to "id" | "name"
