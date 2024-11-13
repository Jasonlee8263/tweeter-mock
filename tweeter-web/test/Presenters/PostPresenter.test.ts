import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";
import { PostPresenter, PostView } from "../../src/presenters/PostPresenter";
import {
  capture,
  deepEqual,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";
describe("PostPresenter test", () => {
  let mockPostPresenterView: PostView;
  let postPresenter: PostPresenter;
  let mockStatusService: StatusService;
  const post = "This is a post";
  const user = new User("jason", "lee", "j", "test");
  const authToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    mockPostPresenterView = mock<PostView>();
    const mockPostPresenterViewInstance = instance(mockPostPresenterView);
    const postPresenterSpy = spy(
      new PostPresenter(mockPostPresenterViewInstance)
    );
    postPresenter = instance(postPresenterSpy);
    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);
    when(postPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);
  });

  it("tells the view to display a posting status message.", async () => {
    await postPresenter.submitPost(post, user, authToken);
    verify(
      mockPostPresenterView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token.", async () => {
    await postPresenter.submitPost(post, user, authToken);
    let [capturedAuthToken, capturedPostStatus] = capture(
      mockStatusService.postStatus
    ).last();
    const expectedStatus = new Status(post, user, capturedPostStatus.timestamp);
    verify(
      mockStatusService.postStatus(
        deepEqual(authToken.token),
        deepEqual(expectedStatus)
      )
    ).once();
  });
  it("tells the view to clear the last info message, clear the post, and display a status posted message", async () => {
    await postPresenter.submitPost(post, user, authToken);
    verify(mockPostPresenterView.setPost("")).once();
    verify(
      mockPostPresenterView.displayInfoMessage("Status posted!", 2000)
    ).once();
    verify(mockPostPresenterView.clearLastInfoMessage()).once();
  });
  // it("tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message", async () => {
  //   const error = new Error("An error occured");
  //   const status = new Status(post, user, Date.now());

  //   // let [capturedAuthToken, capturedPostStatus] = capture(
  //   //   mockStatusService.postStatus
  //   // ).last();
  //   // const expectedStatus = new Status(post, user, capturedPostStatus.timestamp);
  //   when(
  //     mockStatusService.postStatus(
  //       deepEqual(authToken.token),
  //       deepEqual(status)
  //     )
  //   ).thenThrow(error);
  //   await postPresenter.submitPost(post, user, authToken);
  //   verify(
  //     mockPostPresenterView.displayErrorMessage(
  //       `Failed to post the status because of exception: An error occured`
  //     )
  //   ).once();

  //   verify(mockPostPresenterView.setPost("")).never();
  //   verify(
  //     mockPostPresenterView.displayInfoMessage("Status posted!", 2000)
  //   ).never();
  // });
});
