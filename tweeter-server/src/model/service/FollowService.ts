import { UserDto } from "tweeter-shared";
import { FollowsDAO } from "../dao/FollowsDAO";
import { DAOFactory } from "../dao/DAOFactory";
import { SessionsDAO } from "../dao/SessionsDAO";

export class FollowService {
  private followsDAO: FollowsDAO;
  private sessionsDAO: SessionsDAO;

  constructor(daoFactory: DAOFactory) {
    this.followsDAO = daoFactory.createFollowsDAO();
    this.sessionsDAO = daoFactory.createSessionsDAO();
  }

  /**
   * Load a paginated list of followers for a user.
   */
  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const [followerAliases, hasMore] = await this.followsDAO.getFollowers(
      userAlias,
      pageSize,
      lastItem?.alias || null
    );

    const dtos = followerAliases.map((alias) => ({ alias } as UserDto));
    await this.sessionsDAO.updateSession(token, Date.now());
    return [dtos, hasMore];
  }

  /**
   * Load a paginated list of followees for a user.
   */
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const [followeeAliases, hasMore] = await this.followsDAO.getFollowees(
      userAlias,
      pageSize,
      lastItem?.alias || null
    );

    const dtos = followeeAliases.map((alias) => ({ alias } as UserDto));
    await this.sessionsDAO.updateSession(token, Date.now());
    return [dtos, hasMore];
  }

  /**
   * Check if a user is following another user.
   */
  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    try {
      return await this.followsDAO.getIsFollower(
        user.alias,
        selectedUser.alias
      );
    } catch (error) {
      console.error(
        `Error checking if ${user.alias} is following ${selectedUser.alias}:`,
        error
      );
      throw error;
    } finally {
      await this.sessionsDAO.updateSession(token, Date.now());
    }
  }

  /**
   * Get the number of followees for a user.
   */
  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    try {
      return await this.followsDAO.getFolloweeCount(user.alias);
    } catch (error) {
      console.error(`Error getting followee count for ${user.alias}:`, error);
      throw error;
    } finally {
      await this.sessionsDAO.updateSession(token, Date.now());
    }
  }

  /**
   * Get the number of followers for a user.
   */
  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    try {
      return await this.followsDAO.getFollowerCount(user.alias);
    } catch (error) {
      console.error(`Error getting follower count for ${user.alias}:`, error);
      throw error;
    } finally {
      await this.sessionsDAO.updateSession(token, Date.now());
    }
  }

  /**
   * Follow a user and return updated follower and followee counts.
   */
  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[number, number]> {
    try {
      await this.followsDAO.follow(token, userToFollow.alias);

      const followerCount = await this.getFollowerCount(token, userToFollow);
      const followeeCount = await this.getFolloweeCount(token, userToFollow);

      return [followerCount, followeeCount];
    } catch (error) {
      console.error(`Error following ${userToFollow.alias}:`, error);
      throw error;
    } finally {
      await this.sessionsDAO.updateSession(token, Date.now());
    }
  }

  /**
   * Unfollow a user and return updated follower and followee counts.
   */
  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[number, number]> {
    try {
      await this.followsDAO.unfollow(token, userToUnfollow.alias);

      const followerCount = await this.getFollowerCount(token, userToUnfollow);
      const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

      return [followerCount, followeeCount];
    } catch (error) {
      console.error(`Error unfollowing ${userToUnfollow.alias}:`, error);
      throw error;
    } finally {
      await this.sessionsDAO.updateSession(token, Date.now());
    }
  }
}
