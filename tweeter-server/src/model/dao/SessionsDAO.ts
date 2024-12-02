export interface SessionsDAO {
  createSession(token: string, lastused: number, alias: string): Promise<void>;
  getSession(token: string): Promise<string | null>;
  deleteSession(token: string): Promise<void>;
  updateSession(token: string, newLastUsed: number): Promise<void>;
}
