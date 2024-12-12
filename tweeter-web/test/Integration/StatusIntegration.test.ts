import {
  AuthToken,
  LoginRequest,
  PagedStatusItemRequest,
  PostStatusRequest,
  Status,
} from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";
import { instance, mock, spy, verify } from "ts-mockito";
import { PostPresenter, PostView } from "../../src/presenters/PostPresenter";

describe("Integration Tests", () => {
  const server: ServerFacade = new ServerFacade();

  it("Integration Test", async () => {
    const request: LoginRequest = {
      alias: "@daisy",
      password: "test",
    };

    // Call the register function
    const [user, token] = await server.login(request);

    // Assertions to verify the response
    expect(user).toBeDefined();
    expect(token).toBeDefined();
    expect(user.firstName).toBe("daisy");
    expect(user.lastName).toBe("Lee");
    expect(user.alias).toBe("@daisy");

    const mockPostStatusView = mock<PostView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(
      new PostPresenter(mockPostStatusViewInstance)
    );
    const postStatusPresenter = instance(postStatusPresenterSpy);

    await postStatusPresenter.submitPost("post testing", user, token);

    await new Promise((f) => setTimeout(f, 5000));

    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).once();
    verify(mockPostStatusView.clearLastInfoMessage()).once();

    const storyRequest: PagedStatusItemRequest = {
      token: token.token,
      userAlias: user.alias,
      pageSize: 10,
      lastItem: null,
    };

    const [items, hasMore] = await server.getMoreStory(storyRequest);

    expect(items).toBeDefined();
    expect(hasMore).toBeDefined();

    const postFound = items.some(
      (item: any) =>
        item.post === "post testing" && item.user.alias === "@daisy"
    );
    expect(postFound).toBe(true);
  }, 15000);
});
