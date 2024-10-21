import { MemoryRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { instance, mock, verify } from "ts-mockito";
import "@testing-library/jest-dom";
import {
  PostPresenter,
  PostView,
} from "../../../../src/presenters/PostPresenter";
import PostStatus from "../../../../src/components/postStatus/PostStatus";
describe("PostStatus Test", () => {
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
    await act(async () => {
      await user.type(postField, "test post");
    });
    expect(postButton).toBeEnabled();
  });
  const mockPostPresenterGenerator = (view: PostView): PostPresenter => {
    const mockedPostPresenter = mock<PostPresenter>();
    return instance(mockedPostPresenter);
  };
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
