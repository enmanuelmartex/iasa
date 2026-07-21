import { Global, Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';

/**
 * Global so every module encrypts with the same key and the same scheme.
 * Duplicating crypto per-module is how the pre-Phase-0 codebase ended up with
 * two different encryption keys.
 */
@Global()
@Module({
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
