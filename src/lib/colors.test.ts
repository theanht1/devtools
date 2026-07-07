import { parseColor, rgbToHex, rgbToHsl, hslToRgb } from './colors';

describe('colors', () => {
  it('parses hex, rgb() and hsl()', () => {
    expect(parseColor('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColor('#f00')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColor('rgb(0, 128, 255)')).toEqual({ r: 0, g: 128, b: 255 });
    expect(parseColor('hsl(0, 100%, 50%)')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColor('nope')).toBeNull();
  });
  it('rejects out-of-range hsl() saturation', () => {
    expect(parseColor('hsl(0, 500%, 50%)')).toBeNull();
  });
  it('rejects out-of-range hsl() hue', () => {
    expect(parseColor('hsl(400, 100%, 50%)')).toBeNull();
  });
  it('rejects out-of-range rgb() values', () => {
    expect(parseColor('rgb(0, 999, 0)')).toBeNull();
  });
  it('converts rgb to hex', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
  });
  it('rgb <-> hsl round trip', () => {
    const hsl = rgbToHsl({ r: 34, g: 139, b: 34 });
    const back = hslToRgb(hsl);
    expect(Math.abs(back.r - 34)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.g - 139)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.b - 34)).toBeLessThanOrEqual(1);
  });
});
