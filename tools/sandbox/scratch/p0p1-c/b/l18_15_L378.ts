export {};
const user = JSON.parse(localStorage.getItem("user")!) as User;
console.log(user.name.toUpperCase());
