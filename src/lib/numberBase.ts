const DIGITS: Record<number, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^[0-9]+$/,
  16: /^[0-9a-fA-F]+$/,
};
const PREFIX: Record<number, string> = { 2: '0b', 8: '0o', 10: '', 16: '0x' };

export function convertNumber(value: string, fromBase: 2 | 8 | 10 | 16) {
  const v = value.trim();
  if (!DIGITS[fromBase].test(v)) {
    throw new Error(`"${value}" is not a valid base-${fromBase} number`);
  }
  const n = BigInt(PREFIX[fromBase] + v.toLowerCase());
  return { bin: n.toString(2), oct: n.toString(8), dec: n.toString(10), hex: n.toString(16) };
}
