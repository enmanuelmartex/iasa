export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  database: {
    url: process.env.DATABASE_URL,
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  },

  security: {
    encryptionKey: process.env.ENCRYPTION_KEY || 'fallback-encryption-key-32chars',
    bcryptRounds: 12,
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS, 10) || 2000,
  },

  scanner: {
    maxConcurrentScans: parseInt(process.env.MAX_CONCURRENT_SCANS, 10) || 3,
    scanTimeoutMs: parseInt(process.env.SCAN_TIMEOUT_MS, 10) || 300000,
    maxRequestsPerEndpoint: parseInt(process.env.MAX_REQUESTS_PER_ENDPOINT, 10) || 10,
    rateLimitTestRequests: parseInt(process.env.RATE_LIMIT_TEST_REQUESTS, 10) || 25,
    requestDelayMs: parseInt(process.env.REQUEST_DELAY_MS, 10) || 100,
  },

  reports: {
    dir: process.env.REPORTS_DIR || './reports',
  },
});
