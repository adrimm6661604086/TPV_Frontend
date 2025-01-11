export const parseDate = (isoDate : string) => {
    const date = new Date(isoDate);
  
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short', 
      year: 'numeric',
    };
  
    return date.toLocaleDateString('es-ES', options); // 'es-ES' para español
  };