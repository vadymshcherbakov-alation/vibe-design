export interface GroupMember {
  id: number;
  displayName: string;
  email: string;
  avatarUrl?: string;
  lastLogin: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  type: "Built-in" | "Custom";
  memberCount: number;
  definedIn: "Alation" | "Alation Cloud";
  mappedRole?: string;
  members: GroupMember[];
}

export const builtInGroups: Group[] = [
  {
    id: "1",
    name: "Server Admins",
    description: "Full administrative access to the Alation instance",
    type: "Built-in",
    memberCount: 3,
    definedIn: "Alation",
    mappedRole: "Server Admin",
    members: [
      { id: 1, displayName: "server admin", email: "admin@alation.com", lastLogin: "2026-04-07" },
      { id: 2, displayName: "Bart", email: "bart@alation.com", lastLogin: "2026-04-06" },
      { id: 3, displayName: "yogi", email: "yogi@alation.com", lastLogin: "2026-04-05" },
    ],
  },
  {
    id: "2",
    name: "Catalog Admins",
    description: "Manage catalog settings and metadata",
    type: "Built-in",
    memberCount: 24,
    definedIn: "Alation",
    mappedRole: "Catalog Admin",
    members: [
      { id: 1, displayName: "server admin", email: "admin@alation.com", lastLogin: "2026-04-07" },
      { id: 2, displayName: "Bart", email: "bart@alation.com", lastLogin: "2026-04-06" },
      { id: 3, displayName: "yogi", email: "yogi@alation.com", lastLogin: "2026-04-05" },
      { id: 4, displayName: "admin_user5354", email: "admin_user5354@alation.com", lastLogin: "2026-04-03" },
      { id: 5, displayName: "admin_user9790", email: "admin_user9790@alation.com", lastLogin: "2026-04-01" },
      { id: 6, displayName: "admin_user6240", email: "admin_user6240@alation.com", lastLogin: "2026-03-28" },
      { id: 7, displayName: "admin_user3308", email: "admin_user3308@alation.com", lastLogin: "2026-04-06" },
      { id: 8, displayName: "admin_user9639", email: "admin_user9639@alation.com", lastLogin: "2026-03-25" },
      { id: 9, displayName: "admin_user4119", email: "admin_user4119@alation.com", lastLogin: "2026-03-20" },
      { id: 10, displayName: "admin_user690", email: "admin_user690@alation.com", lastLogin: "Never" },
      { id: 11, displayName: "admin_user4411", email: "admin_user4411@alation.com", lastLogin: "2026-03-15" },
      { id: 12, displayName: "admin_user6881", email: "admin_user6881@alation.com", lastLogin: "2026-04-06" },
      { id: 13, displayName: "admin_user205", email: "admin_user205@alation.com", lastLogin: "2026-03-10" },
      { id: 14, displayName: "admin_user864", email: "admin_user864@alation.com", lastLogin: "2026-03-25" },
      { id: 15, displayName: "admin_user9890", email: "admin_user9890@alation.com", lastLogin: "2026-04-07" },
      { id: 16, displayName: "admin_user908", email: "admin_user908@alation.com", lastLogin: "2026-04-07" },
      { id: 17, displayName: "user1", email: "user1@alation.com", lastLogin: "2026-04-06" },
      { id: 18, displayName: "user2", email: "user2@alation.com", lastLogin: "2026-04-03" },
      { id: 19, displayName: "steward3", email: "steward3@alation.com", lastLogin: "2026-04-03" },
      { id: 20, displayName: "user4", email: "user4@alation.com", lastLogin: "2026-03-15" },
      { id: 21, displayName: "user16", email: "user16@alation.com", lastLogin: "2026-03-10" },
      { id: 22, displayName: "steward4", email: "steward4@alation.com", lastLogin: "2026-04-07" },
      { id: 23, displayName: "Abhinav", email: "abhinav@alation.com", lastLogin: "2026-03-15" },
      { id: 24, displayName: "Adam Morgan", email: "adam.morgan@alation.com", lastLogin: "2026-04-03" },
    ],
  },
  {
    id: "5",
    name: "Composer",
    description: "Users with access to Compose for writing and executing queries",
    type: "Built-in",
    memberCount: 18,
    definedIn: "Alation",
    mappedRole: "Composer",
    members: [
      { id: 1, displayName: "server admin", email: "admin@alation.com", lastLogin: "2026-04-07" },
      { id: 2, displayName: "Bart", email: "bart@alation.com", lastLogin: "2026-03-28" },
      { id: 17, displayName: "user1", email: "user1@alation.com", lastLogin: "2026-04-06" },
      { id: 18, displayName: "user2", email: "user2@alation.com", lastLogin: "2026-03-15" },
    ],
  },
  {
    id: "7",
    name: "Explorer",
    description: "Users who can browse and discover data assets in the catalog",
    type: "Built-in",
    memberCount: 45,
    definedIn: "Alation",
    mappedRole: "Explorer",
    members: [
      { id: 1, displayName: "server admin", email: "admin@alation.com", lastLogin: "2026-04-07" },
      { id: 17, displayName: "user1", email: "user1@alation.com", lastLogin: "2026-04-03" },
    ],
  },
  {
    id: "4",
    name: "Source Admin",
    description: "Administrators of data source connections and configurations",
    type: "Built-in",
    memberCount: 8,
    definedIn: "Alation",
    mappedRole: "Source Admin",
    members: [
      { id: 1, displayName: "server admin", email: "admin@alation.com", lastLogin: "2026-03-20" },
    ],
  },
  {
    id: "6",
    name: "Steward",
    description: "Data stewards responsible for data governance and quality",
    type: "Built-in",
    memberCount: 12,
    definedIn: "Alation",
    mappedRole: "Steward",
    members: [
      { id: 19, displayName: "steward3", email: "steward3@alation.com", lastLogin: "2026-03-10" },
      { id: 22, displayName: "steward4", email: "steward4@alation.com", lastLogin: "2026-04-01" },
    ],
  },
  {
    id: "3",
    name: "Viewer",
    description: "Read-only access to the Alation catalog",
    type: "Built-in",
    memberCount: 156,
    definedIn: "Alation",
    mappedRole: "Viewer",
    members: [
      { id: 17, displayName: "user1", email: "user1@alation.com", lastLogin: "2026-01-20" },
    ],
  },
];

export const customGroups: Group[] = [
  {
    id: "27",
    name: "Test",
    description: "Test group for development purposes",
    type: "Custom",
    memberCount: 3,
    definedIn: "Alation",
    members: [
      { id: 1, displayName: "server admin", email: "admin@alation.com", lastLogin: "2025-12-10" },
    ],
  },
  {
    id: "20",
    name: "DP Viewer",
    description: "Data Product viewers group",
    type: "Custom",
    memberCount: 5,
    definedIn: "Alation Cloud",
    members: [
      { id: 17, displayName: "user1", email: "user1@alation.com", lastLogin: "2026-04-07" },
      { id: 18, displayName: "user2", email: "user2@alation.com", lastLogin: "2026-01-20" },
    ],
  },
  {
    id: "19",
    name: "RnD Squad Admins",
    description: "R&D squad administrators",
    type: "Custom",
    memberCount: 7,
    definedIn: "Alation Cloud",
    members: [
      { id: 23, displayName: "Abhinav", email: "abhinav@alation.com", lastLogin: "2026-01-20" },
    ],
  },
];

export const allGroups: Group[] = [...customGroups, ...builtInGroups];

export function getGroupById(id: string): Group | undefined {
  return allGroups.find((g) => g.id === id);
}
