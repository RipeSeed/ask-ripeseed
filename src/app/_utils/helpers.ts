/**
 * Truncates a string if it exceeds a specified length.
 * @param str - The string to truncate.
 * @param n - The maximum length of the truncated string.
 * @returns The truncated string.
 */
export const truncateString = (str: string, n: number) => {
  return str.length > n ? str.slice(0, n - 3) + '...' : str
}
