import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import React, { useContext } from "react";
import { UserTypeContext } from "../App";
import { UserTypes } from "../types";

export default function SelectUserRole() {
  const { user, setUserType } = useContext(UserTypeContext);

  const updateUserType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserType(e.target.value as UserTypes);
    localStorage.setItem("userType", e.target.value);
  };
  return (
    <FormControl display="flex" alignItems="center">
      <FormLabel whiteSpace="nowrap">Select role:</FormLabel>
      <Select width="fit-content" value={user || ""} onChange={updateUserType}>
        <option hidden value="">
          Select one
        </option>
        <option value={UserTypes.Solicitor}>Solicitor</option>
        <option value={UserTypes.Client}>Client</option>
      </Select>
    </FormControl>
  );
}
