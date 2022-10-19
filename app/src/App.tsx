import * as React from "react";
import {
  Container,
  Flex,
  Heading,
  FormControl,
  Select,
  Box,
} from "@chakra-ui/react";

export const App = () => {
  return (
    <Container maxW="1600px" paddingX={{ base: "5px", md: "40px", lg: "60px" }}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        paddingY={{ base: "5px", md: "20px", lg: "30px" }}
      >
        <Heading>Job Board</Heading>
        <Box>
          <FormControl display="flex" alignItems="center">
            <Select placeholder="Select role">
              <option value="solicitor">Solicitor</option>
              <option value="client">Client</option>
            </Select>
          </FormControl>
        </Box>
      </Flex>
    </Container>
  );
};
