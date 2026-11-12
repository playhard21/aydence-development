export interface Review {
  quote: string;
  firstName: string;
  course: string;
}

// Shoba adds up to 3 short student reviews here (later via the content editor).
// While this list is empty, the reviews section stays hidden on the home page.
export const reviews: Review[] = [];
