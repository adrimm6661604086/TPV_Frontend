export const parseDate = (isoDate: string, type: 'short' | 'long') => {
    const date = new Date(isoDate);
  
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: type, 
      year: 'numeric',
    };
  
    return date.toLocaleDateString('es-ES', options); // 'es-ES' para español
  };