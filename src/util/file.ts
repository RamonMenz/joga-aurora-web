export function extractFilenameFromHeader(
  contentDisposition: string | undefined,
  fallbackName: string
): string {
  if (!contentDisposition) {
    return fallbackName;
  }

  // Regex para capturar o filename após "filename="
  const filenameMatch = contentDisposition.match(/filename=([^;]+)/);
  
  if (filenameMatch && filenameMatch[1]) {
    const filename = filenameMatch[1].trim().replace(/['"]/g, '');
    return filename;
  }

  return fallbackName;
}
