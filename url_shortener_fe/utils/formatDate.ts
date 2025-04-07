export function formatDate(isoString: Date, locale: string = "en-US") {
    const date = new Date(isoString);
    return date.toLocaleString(locale, {
      year: "numeric",
      month: "long", // "April"
      day: "2-digit", // "04"
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Change to `false` for 24-hour format
    });
  }