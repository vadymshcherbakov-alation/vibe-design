export function toProductSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export interface DataProduct {
  id: number;
  name: string;
  isDraft: boolean;
  listed: boolean;
  contact: string;
  email: string;
  lastUpdated: string;
  chat: boolean;
}

export const DATA_PRODUCTS: DataProduct[] = [
  { id: 1, name: "Loan Performance Analytics", isDraft: true, listed: false, contact: "Devon Lane", email: "dlane@acme.com", lastUpdated: "Nov 5, 2025 at 2:36 PM", chat: false },
  { id: 2, name: "DHL Emissions", isDraft: false, listed: true, contact: "Cameron Williamson", email: "cwilliamson@acme.com", lastUpdated: "Oct 26, 2025 at 6:01 AM", chat: true },
  { id: 3, name: "Borrower Profile", isDraft: false, listed: false, contact: "Cody Fisher", email: "cfisher@acme.com", lastUpdated: "Sep 15, 2025 at 1:45 PM", chat: false },
  { id: 4, name: "Digital Banking Engagement", isDraft: false, listed: true, contact: "Eleanor Pena", email: "epena@acme.com", lastUpdated: "Aug 8, 2025 at 7:30 PM", chat: true },
  { id: 5, name: "Customer 360 Banking Data Product", isDraft: false, listed: false, contact: "Robert Fox", email: "rfox@acme.com", lastUpdated: "Jul 2, 2025 at 4:00 AM", chat: false },
  { id: 6, name: "Fraud Detection Signals", isDraft: false, listed: false, contact: "Wade Warren", email: "wwarren@acme.com", lastUpdated: "Jun 10, 2025 at 8:17 PM", chat: false },
  { id: 7, name: "Credit Card Spending Benefits and Rewards", isDraft: false, listed: false, contact: "Linda Belcher", email: "lbelcher@acme.com", lastUpdated: "May 5, 2025 at 2:28 PM", chat: false },
  { id: 8, name: "Card Authorization and Decline Insights", isDraft: false, listed: true, contact: "Cameron Williamson", email: "cwilliamson@acme.com", lastUpdated: "Apr 18, 2024 at 9:22 AM", chat: true },
  { id: 9, name: "Fraud Detection Signals", isDraft: false, listed: false, contact: "Wade Warren", email: "wwarren@acme.com", lastUpdated: "Mar 8, 2025 at 7:30 PM", chat: false },
  { id: 10, name: "Fraud Detection Signals", isDraft: false, listed: false, contact: "Wade Warren", email: "wwarren@acme.com", lastUpdated: "Feb 10, 2025 at 8:17 PM", chat: false },
];
