import React from "react";
import { Container } from "@chakra-ui/react";

export default function SectionContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container
      maxW="1600px"
      paddingX={{ base: "5px", md: "40px", lg: "60px" }}
      paddingY={{ base: "5px", md: "20px", lg: "30px" }}
    >
      {children}
    </Container>
  );
}
