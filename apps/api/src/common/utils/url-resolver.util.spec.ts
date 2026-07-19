import { BadRequestException } from '@nestjs/common';
import { assertSafeRemoteUrl } from './url-resolver.util';

describe('assertSafeRemoteUrl', () => {
  const original = process.env.ALLOW_PRIVATE_TARGETS;
  afterEach(() => { process.env.ALLOW_PRIVATE_TARGETS = original; });

  it.each(['file:///etc/passwd', 'ftp://example.com/spec.json', 'http://user:pass@example.com'])('rejects unsafe URL %s', async (url) => {
    await expect(assertSafeRemoteUrl(url)).rejects.toBeInstanceOf(BadRequestException);
  });

  it.each(['http://127.0.0.1/spec.json', 'http://169.254.169.254/latest/meta-data', 'http://10.0.0.1/openapi.json'])('rejects private address %s', async (url) => {
    delete process.env.ALLOW_PRIVATE_TARGETS;
    await expect(assertSafeRemoteUrl(url)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('allows private targets only through the explicit development switch', async () => {
    process.env.ALLOW_PRIVATE_TARGETS = 'true';
    await expect(assertSafeRemoteUrl('http://127.0.0.1:8080/openapi.json')).resolves.toBe('http://127.0.0.1:8080/openapi.json');
  });
});
