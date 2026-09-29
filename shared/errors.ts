export function errorMessage(error: unknown, fallback = "Internal Server Error"): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message
  ) {
    return error.message;
  }
  return fallback;
}

export function errorStatus(error: unknown): number {
  if (typeof error !== "object" || error === null) return 500;
  const status =
    "statusCode" in error ? error.statusCode : "status" in error ? error.status : undefined;
  return typeof status === "number" && Number.isInteger(status) && status >= 400 && status <= 599
    ? status
    : 500;
}

export function hasErrorCode(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}
