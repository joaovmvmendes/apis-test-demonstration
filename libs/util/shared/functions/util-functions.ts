export function randList(vars) {
  let randVar;
  const random = Math.floor(Math.random() * vars.length);
  randVar = vars[random];
  return randVar;
}
