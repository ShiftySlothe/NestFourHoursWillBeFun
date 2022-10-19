import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import Page from "./Page";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Page />
  </ChakraProvider>
);
