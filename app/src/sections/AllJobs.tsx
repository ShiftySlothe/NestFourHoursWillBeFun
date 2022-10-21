import React, { useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { JobPost, UserTypes } from "../types";
import { useMutation } from "react-query";
import { queryClient, UserTypeContext } from "../App";
import SectionContainer from "../layout/Container";
import { useForm, UseFormRegister, FieldValues } from "react-hook-form";

export default function AllJobs() {
  const query = useQuery("jobs", () =>
    axios.get("http://localhost:4000/job-post")
  );

  if (query.isLoading) {
    return <SectionContainer>Loading...</SectionContainer>;
  }

  if (query.isError) {
    return (
      <SectionContainer>There was an error loading the jobs.</SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <Heading>All Jobs</Heading>
      {query.data &&
        query.data.data.map((job: JobPost) => <JobPostItem job={job} />)}
    </SectionContainer>
  );
}

function JobPostItem({ job }: { job: JobPost }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box
        onClick={onOpen}
        key={job._id}
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
  const { user } = useContext(UserTypeContext);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{job.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{job.description}</Text>
          <Text>{job.feeStructure}</Text>
          <SettleAmmountForm job={job} />
          {user === UserTypes.Solicitor && (
            <DeleteJobButton id={job._id} onClick={onClose} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function SettleAmmountForm({ job }: { job: JobPost }) {
  const { register, formState, handleSubmit } = useForm();
  const { errors } = formState;
  const toast = useToast();

  const setPaidMutation = useMutation(
    (id: string) =>
      axios.patch(`http://localhost:4000/job-post/${id}`, { paid: true }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobs");
        toast({
          title: "Job marked as paid.",
          description: "We've marked your job as paid for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      },
      onError: (res: any) => {
        const errorMsg = res.response.data.message;
        toast({
          title: "An error occurred.",
          description: errorMsg,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      },
    }
  );

  const onSubmit = (data: any) => {
    setPaidMutation.mutate(job._id);
  };

  // TODO Fix button styles
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {job.feeStructure === "noWinNoFee" && (
        <SettlementAmmountField job={job} errors={errors} register={register} />
      )}
      {job.feeStructure === "fixedFee" && (
        <FixedFeeField job={job} errors={errors} register={register} />
      )}
    </form>
  );
}

function FixedFeeField({
  job,
  errors,
  register,
}: {
  job: JobPost;
  errors: any;
  register: UseFormRegister<FieldValues>;
}) {
  return (
    <FormControl isInvalid={errors.settlementAmmount}>
      <FormLabel id="settlementAmmount">Fee Ammount</FormLabel>
      <Flex
        direction={"row"}
        gap={3}
        alignItems={"center"}
        justifyContent={"space-between"}
        mt={3}
        width={"100%"}
      >
        <Input
          {...register("settlementAmmount", {
            required: "Settlement ammount is required.",
            min: {
              value: 0,
              message: "Settlement ammount must be greater than 0.",
            },
          })}
          id="settlementAmmount"
          placeholder="Settlement ammount"
          value={job.feeAmmount}
          disabled
        />
        <Button disabled={job.paid} type="submit">
          {job.paid ? "Job paid" : "Mark paid"}
        </Button>
      </Flex>
      <FormErrorMessage>
        {errors.settlementAmmount && errors.settlementAmmount.message}
      </FormErrorMessage>
    </FormControl>
  );
}

function SettlementAmmountField({
  job,
  register,
  errors,
}: {
  job: JobPost;
  register: UseFormRegister<FieldValues>;
  errors: any;
}) {
  const minValue = job.settlementConstraints?.min || 0;
  const maxValue = job.settlementConstraints?.max || Infinity;
  return (
    <FormControl id="settleAmmount" isRequired isInvalid={errors.settleAmmount}>
      <FormLabel>Settlement Ammount</FormLabel>
      <Flex
        direction={"row"}
        gap={3}
        alignItems={"center"}
        justifyContent={"space-between"}
        mt={3}
        width={"100%"}
      >
        <Input
          type="number"
          {...register("settleAmmount", {
            required: "This is required",
            min: {
              value: minValue,
              message: `Minimum value should be ${minValue}`,
            },
            max: {
              value: job.settlementConstraints?.max || Infinity,
              message: `Maximum value should be ${maxValue}`,
            },
          })}
          disabled={job.paid}
          value={job.paid ? job.paidAmount : ""}
        />
        <Button disabled={job.paid} type="submit">
          {job.paid ? "Job paid" : "Mark paid"}
        </Button>
      </Flex>
      <FormHelperText>Please enter the fee percentage.</FormHelperText>
      <FormErrorMessage>
        {errors.settleAmmount && errors.settleAmmount.message}
      </FormErrorMessage>
    </FormControl>
  );
}

function DeleteJobButton({ id, onClick }: { id: string; onClick: () => void }) {
  const toast = useToast();

  const deleteMutation = useMutation(
    (id: string) => axios.delete(`http://localhost:4000/job-post/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobs");
        toast({
          title: "Job deleted.",
          description: "We've deleted your job for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      },
      onError: (res: any) => {
        const errorMsg = res.response.data.message;
        toast({
          title: "An error occurred.",
          description: errorMsg,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      },
    }
  );

  const deleteJob = (id: string) => {
    deleteMutation.mutate(id);
    onClick();
  };

  return (
    <Button
      onClick={() => {
        deleteJob(id);
      }}
    >
      Delete
    </Button>
  );
}
