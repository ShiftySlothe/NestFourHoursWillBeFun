import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import SelectUserRole from "../components/SelectUserRole";
import SectionContainer from "../layout/Container";

export default function Header() {
  return (
    <SectionContainer>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading>Job Board</Heading>
        <Box>
          <SelectUserRole />
        </Box>
      </Flex>
    </SectionContainer>
  );
}
