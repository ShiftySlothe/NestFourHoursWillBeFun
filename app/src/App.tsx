import * as React from "react";
import { UserType } from "./types";
import { useGetUserTypeFromLocalStorage } from "./hooks/userType";
import Page from "./pages";

type UserContextType = {
  user: UserType;
  setUserType: Function;
};

export const UserTypeContext = React.createContext<UserContextType>({
  user: null,
  setUserType: () => {},
});

export const App = () => {
  const value = useGetUserTypeFromLocalStorage();

  return (
    <UserTypeContext.Provider value={value}>
      <Page />
    </UserTypeContext.Provider>
  );
};
