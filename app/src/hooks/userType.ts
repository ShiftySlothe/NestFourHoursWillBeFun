import React from "react";
import { UserType } from "../types";

export function useUserType() {
  const [userType, setUserType] = React.useState<UserType | null>(null);
  const value = { user: userType, setUserType };

  return { value, setUserType };
}

export function useGetUserTypeFromLocalStorage() {
  const { setUserType, value } = useUserType();
  React.useEffect(() => {
    // Check local storage for userType
    const userType = localStorage.getItem("userType");
    if (userType) {
      setUserType(userType as UserType);
    }
  }, [setUserType]);

  return value;
}
