import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { deepEqual, instance, mock, verify, when } from "ts-mockito";
import "@testing-library/jest-dom";
import {
  PostPresenter,
  PostView,
} from "../../../../src/presenters/PostPresenter";
import PostStatus from "../../../../src/components/postStatus/PostStatus";
import useUserInfo from "../../../../src/components/userInfo/UserInfoHook";
import { AuthToken, User } from "tweeter-shared";
jest.mock("../../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));
describe("PostStatus Test", () => {
  let mockUserInstance: User;
  let mockAuthTokenInstance: AuthToken;

  const mockPostPresenterGenerator = (view: PostView): PostPresenter => {
    const mockedPostPresenter = mock<PostPresenter>();
    // when(
    //   mockedPostPresenter.submitPost(
    //     "test post",
    //     deepEqual(mockUserInstance),
    //     deepEqual(mockAuthTokenInstance)
    //   )
    // ).thenResolve(); // Promise<void> 반환
    return instance(mockedPostPresenter);
  };

  beforeAll(() => {
    const mockUser = mock<User>();
    mockUserInstance = instance(mockUser);
    (mockUserInstance as User).firstName = "test";
    (mockUserInstance as User).lastName = "test";
    (mockUserInstance as User).alias = "@test";
    (mockUserInstance as User).imageUrl = "test.com";
    const mockAuthToken = mock<AuthToken>();
    mockAuthTokenInstance = instance(mockAuthToken);
    (mockAuthTokenInstance as AuthToken).token = "test-auth-token";
    (mockAuthTokenInstance as AuthToken).timestamp = 1234567;
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
    console.log(mockAuthTokenInstance);
  });

  it("When first rendered the Post Status and Clear buttons are both disabled.", () => {
    const { postButton, clearButton } = renderPostStatusAndGetElement(
      mockPostPresenterGenerator
    );
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enabled when the text field has text.", async () => {
    const { postButton, postField, user } = renderPostStatusAndGetElement(
      mockPostPresenterGenerator
    );
    await user.type(postField, "test post");
    expect(postButton).toBeEnabled();
  });

  it("Both buttons are disabled when the text field is cleared.", async () => {
    const { postButton, clearButton, postField, user } =
      renderPostStatusAndGetElement(mockPostPresenterGenerator);
    await user.type(postField, "test post");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
    await user.clear(postField);
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls submitPost with correct parameters when the Post Status button is pressed", async () => {
    // Arrange
    const mockPostPresenter = mock<PostPresenter>();
    const mockPostPresenterInstance = instance(mockPostPresenter);
    const { postButton, postField, user } = renderPostStatusAndGetElement(
      () => mockPostPresenterInstance
    );

    await user.type(postField, "test post");
    await user.click(postButton);

    expect(postButton).toBeEnabled();
    verify(
      mockPostPresenter.submitPost(
        "test post",
        deepEqual(mockUserInstance),
        deepEqual(mockAuthTokenInstance)
      )
    ).once();
  });
});
const renderPostStatus = (
  presenterGenerator: (view: PostView) => PostPresenter
) => {
  return render(
    <MemoryRouter>
      <PostStatus presenterGenerator={presenterGenerator}></PostStatus>
    </MemoryRouter>
  );
};

const renderPostStatusAndGetElement = (
  presenterGenerator: (view: PostView) => PostPresenter
) => {
  const user = userEvent.setup();
  renderPostStatus(presenterGenerator);
  const postButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const postField = screen.getByLabelText("post");

  return { postButton, clearButton, postField, user };
};
