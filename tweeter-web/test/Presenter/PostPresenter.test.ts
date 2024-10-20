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
  const status = new Status(post, user, Date.now());

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
    console.log(capturedPostStatus);
    const expectedStatus = new Status(post, user, capturedPostStatus.timestamp);
    verify(
      mockStatusService.postStatus(
        deepEqual(authToken),
        deepEqual(expectedStatus)
      )
    ).once();
  });
});
