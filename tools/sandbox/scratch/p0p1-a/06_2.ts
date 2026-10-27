let message = "hello";
const read = () => message;
message = "bye";
console.log(read()); // "bye"
