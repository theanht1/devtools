import { decodeJwt } from './jwt';

// header {"alg":"HS256","typ":"JWT"} payload {"sub":"1234567890","name":"John Doe","iat":1516239022}
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('decodeJwt', () => {
  it('decodes header and payload', () => {
    const { header, payload } = decodeJwt(TOKEN);
    expect(header).toEqual({ alg: 'HS256', typ: 'JWT' });
    expect(payload).toMatchObject({ sub: '1234567890', name: 'John Doe', iat: 1516239022 });
  });
  it('throws on malformed tokens', () => {
    expect(() => decodeJwt('abc')).toThrow();
    expect(() => decodeJwt('a.!!!.c')).toThrow();
  });
});
