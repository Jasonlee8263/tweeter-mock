import { FeedDAO } from "./FeedDAO";

export class FeedDAOProvider implements FeedDAO {
  receiverAlias: string;
  timestamp: number;
  content: string;
}
