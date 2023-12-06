export function isDigit(char: string): boolean {
  return (
    char.charCodeAt(0) >= "0".charCodeAt(0) &&
    char.charCodeAt(0) <= "9".charCodeAt(0)
  );
}
