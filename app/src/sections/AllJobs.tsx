import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { JobPost } from "../types";
import { useMutation } from "react-query";
import { queryClient } from "../App";
export default function AllJobs() {
  const query = useQuery("jobs", () =>
    axios.get("http://localhost:4000/job-post")
  );

  if (query.isLoading) {
    return <Container>Loading...</Container>;
  }

  if (query.isError) {
    return <Container>There was an error loading the jobs.</Container>;
  }

  return (
    <Container>
      <Heading>All Jobs</Heading>
      {query.data &&
        query.data.data.map((job: JobPost) => <JobPostItem job={job} />)}
    </Container>
  );
}

function JobPostItem({ job }: { job: JobPost }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box
        onClick={onOpen}
        key={job.id}
        border={"1px solid black"}
        borderRadius={"5px"}
        padding={2}
        marginY={4}
        boxShadow="md"
        cursor={"pointer"}
        _hover={{ boxShadow: "lg", transform: "scale(1.001)" }}
        transition={"all 0.2s"}
      >
        <Heading size="md">{job.title}</Heading>
        <Text>{job.description}</Text>
        <Text>{job.feeStructure}</Text>
      </Box>
      <JobPostModal job={job} isOpen={isOpen} onClose={onClose} />
    </>
  );
}

function JobPostModal({
  job,
  isOpen,
  onClose,
}: {
  job: JobPost;
  isOpen: boolean;
  onClose: () => void;
}) {
  const deleteMutation = useMutation(
    () => axios.delete(`http://localhost:4000/job-post/${job.id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobs");
      },
    }
  );

  const setPaidMutation = useMutation(
    () => axios.put(`http://localhost:4000/job-post/${job.id}`, { paid: true }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobs");
      },
    }
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{job.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{job.description}</Text>
          <Text>{job.feeStructure}</Text>
          <Flex
            direction={"row"}
            gap={3}
            alignItems={"center"}
            justifyContent={"space-between"}
            mt={3}
            width={"100%"}
          >
            <Text>Fee total: {job.paidAmount}</Text>
            <Button disabled={job.paid}>
              {job.paid ? "Job paid" : "Mark paid"}
            </Button>
          </Flex>
          <Button>Delete</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
