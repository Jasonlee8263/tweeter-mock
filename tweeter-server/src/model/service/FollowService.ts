import { UserDto } from "tweeter-shared";
import { FollowsDAO } from "../dao/FollowsDAO";
import { DAOFactory } from "../dao/DAOFactory";
import { SessionsDAO } from "../dao/SessionsDAO";
import { UserDAO } from "../dao/UserDAO";

export class FollowService {
  private followsDAO: FollowsDAO;
  private sessionsDAO: SessionsDAO;
  private userDAO: UserDAO;

  constructor(daoFactory: DAOFactory) {
    this.followsDAO = daoFactory.createFollowsDAO();
    this.sessionsDAO = daoFactory.createSessionsDAO();
    this.userDAO = daoFactory.createUserDAO();
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
    console.log("[DEBUG] Loading followers for:", userAlias);

    const dtos = await Promise.all(
      followerAliases.map(async (alias) => {
        const user = await this.userDAO.getUserByAlias(alias);
        if (!user) {
          throw new Error(`User not found for alias: ${alias}`);
        }
        return user;
      })
    );
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
    console.log("[DEBUG] Loading followees for:", userAlias);

    const dtos = await Promise.all(
      followeeAliases.map(async (alias) => {
        const user = await this.userDAO.getUserByAlias(alias);
        if (!user) {
          throw new Error(`User not found for alias: ${alias}`);
        }
        return user;
      })
    );
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

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    try {
      const followerCount = await this.userDAO.getFollowerCount(user.alias);
      return followerCount;
    } catch (error) {
      console.error(`Error fetching follower count for ${user.alias}:`, error);
      throw error;
    }
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    try {
      const followeeCount = await this.userDAO.getFolloweeCount(user.alias);
      return followeeCount;
    } catch (error) {
      console.error(`Error fetching followee count for ${user.alias}:`, error);
      throw error;
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
      const currentUserAlias = await this.sessionsDAO.getAliasByToken(token);
      if (!currentUserAlias) {
        throw new Error("Invalid token or session expired.");
      }
      const currentUser = await this.userDAO.getUserByAlias(currentUserAlias);
      if (!currentUser) {
        throw new Error("Invalid User");
      }
      // Add follow relationship
      await this.followsDAO.follow(currentUserAlias, userToFollow.alias);

      // Increment the follower count for the user being followed
      await this.userDAO.incrementFollowerCount(userToFollow.alias);

      // Increment the followee count for the current user
      await this.userDAO.incrementFolloweeCount(currentUserAlias);

      // Get the updated counts
      const followerCount = await this.getFollowerCount(token, userToFollow);
      const followeeCount = await this.getFolloweeCount(token, currentUser);

      return [followerCount, followeeCount];
    } catch (error) {
      console.error(`Error following ${userToFollow.alias}:`, error);
      throw error;
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
      const currentUserAlias = await this.sessionsDAO.getAliasByToken(token);
      if (!currentUserAlias) {
        throw new Error("Invalid token or session expired.");
      }
      const currentUser = await this.userDAO.getUserByAlias(currentUserAlias);
      if (!currentUser) {
        throw new Error("Invalid User");
      }

      // Remove follow relationship
      await this.followsDAO.unfollow(currentUserAlias, userToUnfollow.alias);

      // Decrement the followerCount for the user being unfollowed
      await this.userDAO.decrementFollowerCount(userToUnfollow.alias);

      // Decrement the followeeCount for the current user
      await this.userDAO.decrementFolloweeCount(currentUserAlias);

      // Get the updated counts
      const followerCount = await this.getFollowerCount(token, userToUnfollow);
      const followeeCount = await this.getFolloweeCount(token, currentUser);

      return [followerCount, followeeCount];
    } catch (error) {
      console.error(`Error unfollowing ${userToUnfollow.alias}:`, error);
      throw error;
    } finally {
      await this.sessionsDAO.updateSession(token, Date.now());
    }
  }
}
