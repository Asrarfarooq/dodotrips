interface TripDetails {
  destination?: string;
  origin?: string;
  date?: Date;
  passengers?: number;
}

export function parseSearchQuery(query: string): TripDetails | null {
  const result: TripDetails = {};
  const lowercaseQuery = query.toLowerCase();

  // Extract destination
  const toMatch = lowercaseQuery.match(/(?:to|in|for) ([a-z\s]+?)(?=\s(?:for|on|next|in|$))/);
  if (toMatch) {
    result.destination = toMatch[1].trim();
  }

  // Extract origin
  const fromMatch = lowercaseQuery.match(/from ([a-z\s]+?)(?=\s(?:to|for|on|next|in|$))/);
  if (fromMatch) {
    result.origin = fromMatch[1].trim();
  }

  // Extract date
  if (lowercaseQuery.includes("next month")) {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    result.date = nextMonth;
  } else {
    const dateMatch = lowercaseQuery.match(/on (\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)/);
    if (dateMatch) {
      result.date = new Date(dateMatch[1]);
    }
  }

  // Extract number of passengers
  const peopleMatch = lowercaseQuery.match(/(\d+)\s*(?:people|person|travelers|travellers|passengers)/);
  if (peopleMatch) {
    result.passengers = parseInt(peopleMatch[1], 10);
  }

  return result.destination ? result : null;
}