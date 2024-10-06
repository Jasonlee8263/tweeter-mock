import { FollowService } from "../model/service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

export interface FollowerView {
}
export class FollowerPresenter extends UserItemPresenter{
    private followerService: FollowService;

    public constructor(view: UserItemView) {
        super(view);
        this.followerService = new FollowService();
    }
}
