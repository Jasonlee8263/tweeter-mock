import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider";
const useInfoHook = () => useContext(UserInfoContext);

export default useInfoHook;
