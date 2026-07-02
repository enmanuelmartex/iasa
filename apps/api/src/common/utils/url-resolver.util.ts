const IS_DOCKER = process.env.DOCKER_ENV === 'true';

const LOCALHOST_PATTERN = /^(https?:\/\/)(localhost|127\.0\.0\.1)(:\d+)?/;

/**
 * Rewrites localhost/127.0.0.1 → host.docker.internal when running inside Docker.
 * On the host machine this is a no-op.
 */
export function resolveTargetUrl(url: string): string {
  if (!IS_DOCKER) return url;
  return url.replace(LOCALHOST_PATTERN, '$1host.docker.internal$3');
}
