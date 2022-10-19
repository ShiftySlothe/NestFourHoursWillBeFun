import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { Box, Container, Heading, Text } from "@chakra-ui/react";

interface JobPost {
  id: string;
  title: string;
  description: string;
  started: boolean;
}
export default function AllJobs() {
  const query = useQuery("jobs", () =>
    axios.get("http://localhost:4000/job-post")
  );

  if (query.isLoading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Heading>All Jobs</Heading>
      {query.data &&
        query.data.data.map((job: JobPost) => (
          <Box
            key={job.id}
            border="1px solid black"
            borderRadius="5px"
            padding={2}
            marginY={4}
            boxShadow="md"
          >
            <Heading size="md">{job.title}</Heading>
            <Text>{job.description}</Text>
          </Box>
        ))}
    </Container>
  );
}
