/**
 * Extrai o nome do arquivo do header Content-Disposition
 * @param contentDisposition - Header Content-Disposition da resposta HTTP
 * @param fallbackName - Nome padrão caso não seja possível extrair
 * @returns Nome do arquivo extraído ou fallback
 * 
 * @example
 * // Formato: "attachment; filename=presenca_turma_1A_09-12-2024_a_02-12-2025.xlsx"
 * const filename = extractFilenameFromHeader(response.headers['content-disposition'], 'report.xlsx');
 */
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
