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
    (data: { feeAmmount: number }) => {
      const feeAmmount = data.feeAmmount;
      return axios.patch(`http://localhost:4000/job-post/set-paid/${job._id}`, {
        feeAmmount,
      });
    },
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

  // TODO passing correct type throws error, review typescript
  // support for react-hook-form
  const onSubmit = (data: any) => {
    console.log(data);
    setPaidMutation.mutate(data);
  };

  // TODO Fix button styles
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {job.feeStructure === "noWinNoFee" && (
        <NoWinNoFeeField job={job} errors={errors} register={register} />
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
  // TODO throw sentry error if there is no feeAmmount
  return (
    <FormControl isInvalid={errors.settlementAmmount}>
      <FormLabel id="feeAmmount">Fee Ammount</FormLabel>
      <Flex
        direction={"row"}
        gap={3}
        alignItems={"center"}
        justifyContent={"space-between"}
        mt={3}
        width={"100%"}
      >
        <Input
          {...register("feeAmmount", {
            required: "Required",
            min: {
              value: job.feeAmmount || 0,
              message: `The fee ammount must match £${job.feeAmmount}`,
            },
            max: {
              value: job.feeAmmount || Infinity,
              message: `The fee ammount must match £${job.feeAmmount}`,
            },
          })}
          id="feeAmmount"
          placeholder={job.feeAmmount?.toString() || ""}
        />
        <Button disabled={job.paid} type="submit">
          {job.paid ? "Job paid" : "Mark paid"}
        </Button>
      </Flex>
      <FormHelperText>
        Confirm ammount by entering {job.feeAmmount?.toString()} above.
      </FormHelperText>
      <FormErrorMessage>
        {errors.feeAmmount && errors.feeAmmount.message}
      </FormErrorMessage>
    </FormControl>
  );
}

function NoWinNoFeeField({
  job,
  register,
  errors,
}: {
  job: JobPost;
  register: UseFormRegister<FieldValues>;
  errors: any;
}) {
  // Settlement ammount should be within 10% of min/max
  const minValue = (job.settlementConstraints?.min || 0) * 0.9;
  const maxValue = (job.settlementConstraints?.max || Infinity) * 1.1;

  return (
    <FormControl id="feeAmmount" isRequired isInvalid={errors.feeAmmount}>
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
          {...register("feeAmmount", {
            required: "This is required.",
            min: {
              value: minValue,
              message: `Minimum expect settlement is ${minValue}. Contact your solilcitor for more information.`,
            },
            max: {
              value: job.settlementConstraints?.max || Infinity,
              message: `Maximum expected settlement is ${maxValue}. Contact your solilcitor for more information.`,
            },
          })}
          disabled={job.paid}
          defaultValue={job.feeAmmount}
        />
        <Button disabled={job.paid} type="submit">
          {job.paid ? "Job paid" : "Mark paid"}
        </Button>
      </Flex>
      <FormHelperText>Please enter the fee percentage.</FormHelperText>
      <FormErrorMessage>
        {errors.feeAmmount && errors.feeAmmount.message}
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
