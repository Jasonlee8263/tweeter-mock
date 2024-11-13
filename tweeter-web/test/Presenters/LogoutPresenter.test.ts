import { AuthToken } from "tweeter-shared";
import {
  LogoutPresenter,
  LogoutView,
} from "../../src/presenters/LogoutPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";
import { UserService } from "../../src/model/service/UserService";
describe("LogoutPresenter test", () => {
  let mockLogoutPresenterView: LogoutView;
  let logoutPresenter: LogoutPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    mockLogoutPresenterView = mock<LogoutView>();
    const mockLogoutPresenterViewInstance = instance(mockLogoutPresenterView);
    const logoutPresenterSpy = spy(
      new LogoutPresenter(mockLogoutPresenterViewInstance)
    );
    logoutPresenter = instance(logoutPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    when(logoutPresenterSpy.userService).thenReturn(mockUserServiceInstance);
  });
  it("tells the view to display a logging out message", async () => {
    await logoutPresenter.logOut(authToken);
    verify(
      mockLogoutPresenterView.displayInfoMessage("Logging Out...", 0)
    ).once();
  });
  it("calls logout on the user service with the correct auth token", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockUserService.logout(authToken.token)).once();

    // let [capturedAuthToken] = capture(mockUserService.logout).last();
    // expect(capturedAuthToken).toEqual(authToken);
  });
  it("tells the view to clear the last info message and clear the user info.", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockLogoutPresenterView.clearLastInfoMessage()).once();
    verify(mockLogoutPresenterView.clearUserInfo()).once();
  });
  it("tells the view to display an error message and does not tell it to clear the last info message or clear the user info", async () => {
    const error = new Error("An error occured");
    when(mockUserService.logout(authToken.token)).thenThrow(error);
    await logoutPresenter.logOut(authToken);
    verify(
      mockLogoutPresenterView.displayErrorMessage(
        `Failed to log user out because of exception: An error occured`
      )
    ).once();

    verify(mockLogoutPresenterView.clearLastInfoMessage()).never();
    verify(mockLogoutPresenterView.clearUserInfo()).never();
  });
});
