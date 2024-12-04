import { PostSegmentDto, StatusDto } from "tweeter-shared";

export interface FeedDAO {
  getFeedPage(
    receiverAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<
    [{ authorAlias: string; content: string; timestamp: number }[], boolean]
  >;

  addToFeeds(status: {
    receiverAlias: string;
    timestamp: number;
    content: string;
    authorAlias: string;
  }): Promise<void>;
}
