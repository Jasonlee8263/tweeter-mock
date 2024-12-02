import { DAOFactory } from "./DAOFactory";
import { FeedDAO } from "./FeedDAO";
// import { FeedDAOProvider } from "./FeedDAOProvider";
import { FollowsDAO } from "./FollowsDAO";
// import { FollowsDAOProvider } from "./FollowsDAOProvider";
import { S3DAO } from "./S3DAO";
import { S3DAOProvider } from "./S3DAOProvider";
import { SessionsDAO } from "./SessionsDAO";
// import { SessionsDAOProvider } from "./SessionsDAOProvider";
import { StoryDAO } from "./StoryDAO";
// import { StoryDAOProvider } from "./StoryDAOProvider";
import { UserDAO } from "./UserDAO";
import { UserDAOProvider } from "./UserDAOProvider";
import { SessionsDAOProvider } from "./SessionsDAOProvider";

export class DAOFactoryClass implements DAOFactory {
  createUserDAO(): UserDAO {
    return new UserDAOProvider();
  }
  createSessionsDAO(): SessionsDAO {
    return new SessionsDAOProvider();
  }
  // createStoryDAO(): StoryDAO {
  //   return new StoryDAOProvider();
  // }
  // createFeedDAO(): FeedDAO {
  //   return new FeedDAOProvider();
  // }
  // createFollowsDAO(): FollowsDAO {
  //   return new FollowsDAOProvider();
  // }
  createS3DAO(): S3DAO {
    return new S3DAOProvider();
  }
}
