export function formatDateToLocale(dateString: string, locale: string = "pt-BR"): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error("Data inválida");
    }
    const formatter = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });
    return formatter.format(date);
}

// Retorna apenas a parte yyyy-MM-dd de uma Date
export function formatDateOnly(d: Date): string {
    return d.toISOString().split("T")[0];
}

// Faz parse seguro de string para Date; retorna null se inválida
export function parseDateSafe(v: string | Date | null | undefined): Date | null {
    if (!v) return null;
    if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
}
