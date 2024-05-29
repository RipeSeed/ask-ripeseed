export type Message = {
  content: string | null;
  role: "user" | "system";
  createdAt: Date;
};
