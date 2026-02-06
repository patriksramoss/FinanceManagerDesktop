export function truncateNumber(num: number) {
  const str = num.toFixed(0); // integer only
  return str.length > 4 ? str.slice(0, 4) + "..." : str;
}
