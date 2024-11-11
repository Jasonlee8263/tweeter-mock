// Domain Classes
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

// All classes that should be avaialble to other modules need to exported here. export * does not work when
// uploading to lambda. Instead we have to list each export.

//DTOs
export type { UserDto } from "./model/dto/UserDto";
export type { StatusDto } from "./model/dto/StatusDto";
export type { PostSegmentDto } from "./model/dto/PostSegmentDto";

//Requests
export type { PagedUserItemRequest } from "./model/net/request/PagedUserItemRequest";
export type { GetFollowCountRequest } from "./model/net/request/GetFollowCountRequest";
export type { GetIsFollowerStatusRequest } from "./model/net/request/GetIsFollowerStatusRequest";
export type { PagedStatusItemRequest } from "./model/net/request/PagedStatusItemRequest";

//Response
export type { PagedUserItemResponse } from "./model/net/response/PagedUserItemResponse";
export type { GetFollowCountResponse } from "./model/net/response/GetFollowCountResponse";
export type { GetIsFollowerStatusResponse } from "./model/net/response/GetIsFollowerStatusResponse";
export type { PagedStatusItemResponse } from "./model/net/response/PagedStatusItemResponse";

export { FakeData } from "./util/FakeData";
