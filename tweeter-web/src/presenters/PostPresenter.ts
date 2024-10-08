import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface PostView {
    setPost: (post: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    displayErrorMessage: (message: string) => void;
    clearLastInfoMessage: () => void;
}
export class PostPresenter {
    private _view: PostView;
    private statusService: StatusService;
    constructor(view: PostView) {
        this._view = view;
        this.statusService = new StatusService();
    }
    public async submitPost(post: string, currentUser: User | null, authToken: AuthToken | null): Promise<void> {
    
        try {
          this._view.setIsLoading(true);
          this._view.displayInfoMessage("Posting status...", 0);
    
          const status = new Status(post, currentUser!, Date.now());
    
          await this.statusService.postStatus(authToken!, status);
    
          this._view.setPost("");
          this._view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to post the status because of exception: ${error}`
          );
        } finally {
          this._view.clearLastInfoMessage();
          this._view.setIsLoading(false);
        }
      };

}