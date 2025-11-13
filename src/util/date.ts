export function formatDateToLocale(dateString: string, locale: string = 'pt-BR'): string {
    // Cria o objeto Date a partir da string recebida
    const date = new Date(dateString);

    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
        throw new Error("Data inválida");
    }

    // Configuração do formato (ano, mês e dia)
    const formatter = new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    // Retorna a data formatada
    return formatter.format(date);
}
