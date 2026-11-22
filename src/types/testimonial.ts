export interface TestimonialItem {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  organization: string;
  projectContext?: string;
  isPlaceholder?: boolean;
}
