import { StatusDto } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
import { FeedDAO } from "../dao/FeedDAO";
import { FollowsDAO } from "../dao/FollowsDAO";
import { StoryDAO } from "../dao/StoryDAO";
import { UserDAO } from "../dao/UserDAO";

export class StatusService {
  private feedDAO: FeedDAO;
  private storyDAO: StoryDAO;
  private userDAO: UserDAO;
  private followDAO: FollowsDAO;

  constructor(daoFactory: DAOFactory) {
    this.feedDAO = daoFactory.createFeedDAO();
    this.storyDAO = daoFactory.createStoryDAO();
    this.userDAO = daoFactory.createUserDAO();
    this.followDAO = daoFactory.createFollowsDAO();
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

    return [dtos, hasMore];
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // 1. getStoryPage 호출 전 입력 파라미터 출력
    console.log("[DEBUG] loadMoreStoryItems - Params:", {
      token,
      userAlias,
      pageSize,
      lastItem,
    });

    try {
      const { items, hasMore } = await this.storyDAO.getStoryPage(
        userAlias,
        pageSize,
        lastItem?.timestamp || null
      );
      // 2. storyDAO.getStoryPage 결과 출력
      console.log("[DEBUG] getStoryPage Result:", { items, hasMore });

      const dtos = await Promise.all(
        items.map(async (status) => {
          const user = await this.userDAO.getUserByAlias(status.authorAlias);
          // 4. 사용자 정보 결과 확인
          console.log("[DEBUG] User fetched:", user);

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
      // 5. 최종 변환된 DTO 출력
      console.log("[DEBUG] Final StatusDtos:", dtos);

      return [dtos, hasMore];
    } catch (error) {
      console.error("Error in loadMoreStoryItems:", error);
      throw error;
    }
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    const { post, user, timestamp } = newStatus;

    console.log("[DEBUG] Adding to story for user:", user.alias);

    // Story 추가
    await this.storyDAO.addStory({
      authorAlias: user.alias,
      timestamp: timestamp,
      content: post,
    });

    // Followers 조회
    const [followers] = await this.followDAO.getFollowers(user.alias, 1, null);

    console.log("[DEBUG] Followers fetched:", { followers });

    // 각 팔로워의 피드에 작성자 alias와 함께 추가
    await Promise.all(
      followers.map(async (followerAlias) => {
        console.log("[DEBUG] Adding to feed for follower:", followerAlias);
        await this.feedDAO.addToFeeds({
          receiverAlias: followerAlias,
          timestamp: timestamp,
          content: post,
          authorAlias: user.alias, // 작성자 alias만 저장
        });
      })
    );

    console.log("[DEBUG] Post successfully added to feeds.");
  }
}
