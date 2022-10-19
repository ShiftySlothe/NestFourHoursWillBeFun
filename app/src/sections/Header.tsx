import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Select,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { UserTypeContext } from "../App";
import SectionContainer from "../layout/Container";
import { UserTypes } from "../types";

export default function Header() {
  const { user, setUserType } = useContext(UserTypeContext);

  const updateUserType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Updating user type to: ", e.target.value);
    setUserType(e.target.value as UserTypes);
    localStorage.setItem("userType", e.target.value);
  };

  return (
    <SectionContainer>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading>Job Board</Heading>
        <Box>
          <FormControl display="flex" alignItems="center">
            <FormLabel whiteSpace="nowrap">Select role:</FormLabel>
            <Select
              width="fit-content"
              value={user || ""}
              onChange={updateUserType}
            >
              <option hidden value="">
                Select one
              </option>
              <option value={UserTypes.Solicitor}>Solicitor</option>
              <option value={UserTypes.Client}>Client</option>
            </Select>
          </FormControl>
        </Box>
      </Flex>
    </SectionContainer>
  );
}
