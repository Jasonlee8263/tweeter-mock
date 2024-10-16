import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostView extends MessageView {
  setPost: (post: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}
export class PostPresenter extends Presenter<PostView> {
  private statusService: StatusService;
  constructor(view: PostView) {
    super(view);
    this.statusService = new StatusService();
  }
  public async submitPost(
    post: string,
    currentUser: User | null,
    authToken: AuthToken | null
  ): Promise<void> {
    this.view.setIsLoading(true);
    this.view.displayInfoMessage("Posting status...", 0);
    this.itemHandler(async () => {
      const status = new Status(post, currentUser!, Date.now());
      await this.statusService.postStatus(authToken!, status);
      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }, "post the status");
  }
}
