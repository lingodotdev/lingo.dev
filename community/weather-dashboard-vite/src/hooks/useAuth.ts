import { useSelector } from "react-redux";
import {type RootState } from "../app/store";

export const useAuth = () => {
  const user = useSelector((s: RootState) => s.auth.user);
  return { user, isLoggedIn: !!user };
};
