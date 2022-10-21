import * as React from "react";
import { UserType } from "./types";
import { useGetUserTypeFromLocalStorage } from "./hooks/userType";
import Page from "./pages";
import SignInModal from "./sections/SignInModal";
import { QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <UserTypeContext.Provider value={value}>
        {!value.user ? <SignInModal setOpen /> : null}
        <Page />
      </UserTypeContext.Provider>
    </QueryClientProvider>
  );
};
