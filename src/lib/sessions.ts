export type Session = {
  id: string;
  title: string;
  leader: string;
  description: string;
  color: string;
};

export const sessions: Session[] = [
  {
    id: "gifting",
    title: "Finding Your Gifting",
    leader: "Cameron Stewart",
    description:
      "Understanding your personality, strengths, and whether you're more of a visionary or integrator.",
    color: "#c2410c",
  },
  {
    id: "team",
    title: "Build the Right Team: Hiring & Keeping Key Employees",
    leader: "Gabe Matthews",
    description:
      "Finding, developing, compensating, and retaining key employees for long-term growth.",
    color: "#1d4ed8",
  },
  {
    id: "delegation",
    title: "Get Out of Your Own Way",
    leader: "Paul Tarpy",
    description:
      "Delegation, letting go, avoiding micromanagement, and focusing your time on the areas where you create the most value.",
    color: "#15803d",
  },
];

export const sessionIds = sessions.map((s) => s.id);

export type Counts = Record<string, number>;
