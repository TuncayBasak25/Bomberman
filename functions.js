export function random100(range = 100) {
  return Math.floor(Math.random() * range);
}



export function isPaire(number) {
  if (number%2 === 0) {
    return true;
  }
  else {
    return false;
  }
}
