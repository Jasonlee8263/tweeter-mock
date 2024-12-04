export interface StoryDAO {
  getStoryPage(
    authorAlias: string,
    pageSize: number,
    lastTimestamp: number | null
  ): Promise<{
    items: { authorAlias: string; timestamp: number; content: string }[];
    hasMore: boolean;
  }>;

  addStory(status: {
    authorAlias: string;
    timestamp: number;
    content: string;
  }): Promise<void>;
}
