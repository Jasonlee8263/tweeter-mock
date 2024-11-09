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

//Requests
export type { PagedUserItemRequest } from "./model/net/request/PagedUserItemRequest";
export type { GetFollowCountRequest } from "./model/net/request/GetFollowCountRequest";
//Response
export type { PagedUserItemResponse } from "./model/net/response/PagedUserItemResponse";
export type { GetFollowCountResponse } from "./model/net/response/GetFollowCountResponse";

export { FakeData } from "./util/FakeData";
