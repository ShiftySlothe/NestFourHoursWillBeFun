import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useForm, UseFormRegister, FieldValues } from "react-hook-form";
import { useMutation } from "react-query";
import axios from "axios";
import { queryClient } from "../App";

export default function CreateJobForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const createJobMutation = useMutation(
    (formData: FieldValues) => {
      const data = { ...formData, started: true };
      return axios.post("http://localhost:4000/job-post", data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobs");
      },
    }
  );

  function onSubmit(values: FieldValues) {
    createJobMutation.mutate(values);
  }

  return (
    <Container>
      <Heading marginBottom={4}>Create a new job</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TitleField register={register} errors={errors} />
        <DescriptionField register={register} errors={errors} />
        <FeeType register={register} errors={errors} />
        <FormControl>
          <Button
            marginTop={4}
            type="submit"
            isLoading={isSubmitting || createJobMutation.isLoading}
          >
            Submit
          </Button>
        </FormControl>
      </form>
      {createJobMutation.isError && (
        <Text color="red">
          There was an error creating your job, please try again.
        </Text>
      )}
    </Container>
  );
}

function TitleField({
  register,
  errors,
}: {
  register: UseFormRegister<FieldValues>;
  errors: any;
}) {
  return (
    <FormControl id="title" isRequired isInvalid={errors.title}>
      <FormLabel>Title</FormLabel>
      <Input
        type="text"
        {...register("title", {
          required: "This is required",
          minLength: { value: 4, message: "Minimum length should be 4" },
        })}
      />
      <FormHelperText>Please enter the title of the job.</FormHelperText>
      <FormErrorMessage>
        {errors.title && errors.title.message}
      </FormErrorMessage>
    </FormControl>
  );
}

function DescriptionField({
  register,
  errors,
}: {
  register: UseFormRegister<FieldValues>;
  errors: any;
}) {
  return (
    <FormControl id="description" isRequired isInvalid={errors.description}>
      <FormLabel>Description</FormLabel>
      <Input
        type="text"
        required
        {...register("description", {
          required: "This is required",
          minLength: { value: 5, message: "Minimum length should be 5" },
        })}
      />
      <FormHelperText>Please enter a description for the job.</FormHelperText>
      <FormErrorMessage>
        {errors.description && errors.description.message}
      </FormErrorMessage>
    </FormControl>
  );
}

function FeeType({
  register,
  errors,
}: {
  register: UseFormRegister<FieldValues>;
  errors: any;
}) {
  return (
    <FormControl id="feeStructure" isRequired isInvalid={errors.description}>
      <FormLabel>Description</FormLabel>
      <Select
        {...register("feeStructure", {
          required: "This is required",
        })}
        placeholder="Select option"
      >
        <option value="fixedFee">Fixed Fee</option>
        <option value="noWinNoFee">No Win No Fee</option>
      </Select>
      <FormHelperText>Please select a fee type.</FormHelperText>
      <FormErrorMessage>
        {errors.description && errors.description.message}
      </FormErrorMessage>
    </FormControl>
  );
}
