import { StatusDto } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
import { FeedDAO } from "../dao/FeedDAO";
import { FollowsDAO } from "../dao/FollowsDAO";
import { StoryDAO } from "../dao/StoryDAO";
import { UserDAO } from "../dao/UserDAO";
import { SessionsDAO } from "../dao/SessionsDAO";

export class StatusService {
  private feedDAO: FeedDAO;
  private storyDAO: StoryDAO;
  private userDAO: UserDAO;
  private followDAO: FollowsDAO;
  private sessionDAO: SessionsDAO;

  constructor(daoFactory: DAOFactory) {
    this.feedDAO = daoFactory.createFeedDAO();
    this.storyDAO = daoFactory.createStoryDAO();
    this.userDAO = daoFactory.createUserDAO();
    this.followDAO = daoFactory.createFollowsDAO();
    this.sessionDAO = daoFactory.createSessionsDAO();
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = await this.feedDAO.getFeedPage(
      userAlias,
      pageSize,
      lastItem
    );

    const dtos = await Promise.all(
      items.map(async (status) => {
        const user = await this.userDAO.getUserByAlias(status.authorAlias);
        if (!user) {
          throw new Error(`User not found for alias: ${status.authorAlias}`);
        }
        return {
          post: status.content,
          user: user,
          timestamp: status.timestamp,
          segments: [], // DB에 저장하지 않으므로 빈 배열로 처리.
        } as StatusDto;
      })
    );
    await this.sessionDAO.updateSession(token, Date.now());
    return [dtos, hasMore];
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    try {
      const { items, hasMore } = await this.storyDAO.getStoryPage(
        userAlias,
        pageSize,
        lastItem?.timestamp || null
      );
      const dtos = await Promise.all(
        items.map(async (status) => {
          const user = await this.userDAO.getUserByAlias(status.authorAlias);

          if (!user) {
            throw new Error(`User not found for alias: ${status.authorAlias}`);
          }
          return {
            post: status.content,
            user: user,
            timestamp: status.timestamp,
            segments: [], // DB에 저장하지 않으므로 빈 배열로 처리.
          } as StatusDto;
        })
      );

      return [dtos, hasMore];
    } catch (error) {
      console.error("Error in loadMoreStoryItems:", error);
      throw error;
    } finally {
      await this.sessionDAO.updateSession(token, Date.now());
    }
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    const { post, user, timestamp } = newStatus;

    await this.storyDAO.addStory({
      authorAlias: user.alias,
      timestamp: timestamp,
      content: post,
    });

    const [followers] = await this.followDAO.getFollowers(user.alias, 1, null);

    // 각 팔로워의 피드에 작성자 alias와 함께 추가
    await Promise.all(
      followers.map(async (followerAlias) => {
        await this.feedDAO.addToFeeds({
          receiverAlias: followerAlias,
          timestamp: timestamp,
          content: post,
          authorAlias: user.alias,
        });
      })
    );

    await this.sessionDAO.updateSession(token, Date.now());
  }
}
