/**
 * Logs messages to the console in development mode.
 * We could strip logs, but this way we can still use console.log if
 * we want to actually see the logs in production or use this method for
 * information that might be sensitive showing up in production logs via
 * DataDog RUM.
 * @param args The messages to log.
 */
export function devLogger(...args: readonly unknown[]) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
}
