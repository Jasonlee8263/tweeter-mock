import { ServerFacade } from "../../src/network/ServerFacade";
import {
  GetFollowCountRequest,
  PagedUserItemRequest,
  RegisterRequest,
} from "tweeter-shared";
import "isomorphic-fetch";

describe("ServerFacade test", () => {
  let mockServerFacade: ServerFacade;
  beforeAll(() => {
    mockServerFacade = new ServerFacade();
  });
  it("Test register", async () => {
    const request: RegisterRequest = {
      firstName: "Jason",
      lastName: "Lee",
      alias: "@Jason",
      password: "test",
      userImageBytes: "bytes",
      imageFileExtension: "png",
    };
    const response = await mockServerFacade.register(request);
    expect(response).toBeDefined();
    expect(response[0].firstName).toBe("Allen");
  });
  it("Test getFollowers", async () => {
    const request: PagedUserItemRequest = {
      token: "token",
      userAlias: "@Jason",
      pageSize: 1,
      lastItem: null,
    };
    const response = await mockServerFacade.getMoreFollowers(request);
    expect(response).toBeDefined();
  });
  it("Test getFollowerCount", async () => {
    const request: GetFollowCountRequest = {
      token: "token",
      user: {
        firstName: "Jason",
        lastName: "Lee",
        alias: "@Jason",
        imageUrl: "url",
      },
    };
    const response = await mockServerFacade.getFollowerCount(request);
    expect(response).toBeDefined();
  });
});
