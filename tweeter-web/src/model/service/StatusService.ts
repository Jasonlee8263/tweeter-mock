import { AuthToken, FakeData, Status, StatusDto } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";
export class StatusService {
  private serverFacade = new ServerFacade();

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request = {
      token: token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };
    // TODO: Replace with the result of calling server
    return await this.serverFacade.getMoreFeeds(request);
    // return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }
  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request = {
      token: token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };
    // TODO: Replace with the result of calling server
    // return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    return await this.serverFacade.getMoreStory(request);
  }

  public async postStatus(token: string, newStatus: Status): Promise<void> {
    const request = {
      token: token,
      newStatus: newStatus.dto,
    };
    // Pause so we can see the logging out message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));
    await this.serverFacade.postStatus(request);

    // TODO: Call the server to post the status
  }
}
