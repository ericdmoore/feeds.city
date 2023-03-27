export const err = (input: unknown, reason: string, stack?: string) => ({
  error: true,
  input,
  reason,
  err: stack ?? new Error().stack,
});
export default err;
