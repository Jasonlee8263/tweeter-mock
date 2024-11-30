import { FeedDAO } from "./FeedDAO";
import { FollowsDAO } from "./FollowsDAO";
import { S3DAO } from "./S3DAO";
import { SessionsDAO } from "./SessionsDAO";
import { StoryDAO } from "./StoryDAO";
import { UserDAO } from "./UserDAO";

export interface DAOFactory {
  createUserDAO(): UserDAO;
  createSessionsDAO(): SessionsDAO;
  createStoryDAO(): StoryDAO;
  createFeedDAO(): FeedDAO;
  createFollowsDAO(): FollowsDAO;
  createS3DAO(): S3DAO;
}
