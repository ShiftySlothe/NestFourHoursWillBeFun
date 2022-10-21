import {
  Button,
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
import { useToast } from "@chakra-ui/react";
import SectionContainer from "../layout/Container";

export default function CreateJobForm() {
  const { handleSubmit, register, formState } = useForm();
  const toast = useToast();

  const { errors, isSubmitting } = formState;

  const createJobMutation = useMutation(
    // TODO: Find out how to type this
    (formData: FieldValues) => {
      // Turns feePercentage into correct decimal from numeric value
      if (formData.feePercentage) {
        formData.feePercentage = formData.feePercentage * 0.01;
      }

      if (formData.feeStructure === "noWinNoFee") {
        if (!formData.minSettlement || !formData.maxSettlement) {
          // TODO: Raise sentry error
        }
        formData.settlementConstraints = {
          min: formData.minSettlement,
          max: formData.maxSettlement,
        };
        delete formData.minSettlement;
        delete formData.maxSettlement;
      }

      const data = { ...formData, started: true, paid: false };
      return axios.post("http://localhost:4000/job-post", data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobs");
        toast({
          title: "Job created.",
          description: "We've created your job for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      },
      // TODO: Remove any type
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

  function onSubmit(values: FieldValues) {
    createJobMutation.mutate(values);
  }

  return (
    <SectionContainer>
      <Heading marginBottom={4}>Create a new job</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TitleField register={register} errors={errors} />
        <DescriptionField register={register} errors={errors} />
        <FeeStructure register={register} errors={errors} />
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
    </SectionContainer>
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

function FeeStructure({
  register,
  errors,
}: {
  register: UseFormRegister<FieldValues>;
  errors: any;
}) {
  const [feeStructure, setFeeStructure] = React.useState<string>("");
  return (
    <>
      <FormControl id="feeStructure" isRequired isInvalid={errors.feeStructure}>
        <FormLabel>Fee Structure</FormLabel>
        <Select
          {...register("feeStructure", {
            required: "This is required",
          })}
          placeholder="Select option"
          onChange={(e) => setFeeStructure(e.target.value)}
        >
          <option value="fixedFee">Fixed Fee</option>
          <option value="noWinNoFee">No Win No Fee</option>
        </Select>
        <FormHelperText>Please select a fee type.</FormHelperText>
        <FormErrorMessage>
          {errors.feeStructure && errors.feeStructure.message}
        </FormErrorMessage>
      </FormControl>
      {feeStructure === "fixedFee" && (
        <FeeAmmount register={register} errors={errors} />
      )}
      {feeStructure === "noWinNoFee" && (
        <>
          <FeePercentage register={register} errors={errors} />
          <MinSettlement register={register} errors={errors} />
          <MaxSettlement register={register} errors={errors} />
        </>
      )}
    </>
  );
}

// Fee Percentage Field
function FeePercentage({
  register,
  errors,
}: {
  register: UseFormRegister<FieldValues>;
  errors: any;
}) {
  return (
    <FormControl id="feePercentage" isRequired isInvalid={errors.feePercentage}>
      <FormLabel>Fee Percentage</FormLabel>
      <Input
        type="number"
        {...register("feePercentage", {
          required: "This is required",
          min: { value: 1, message: "Minimum value should be 1" },
          max: { value: 100, message: "Maximum value should be 100" },
        })}
      />
      <FormHelperText>Please enter the fee percentage.</FormHelperText>
      <FormErrorMessage>
        {errors.feePercentage && errors.feePercentage.message}
      </FormErrorMessage>
    </FormControl>
  );
}

function FeeAmmount({
  register,
  errors,
}: {
  register: UseFormRegister<FieldValues>;
  errors: any;
}) {
  return (
    <FormControl id="feeAmmount" isRequired isInvalid={errors.feeAmmount}>
      <FormLabel>Fee Ammount</FormLabel>
      <Input
        type="number"
        {...register("feeAmmount", {
          required: "This is required",
        })}
      />
      <FormHelperText>Please enter the fee ammount.</FormHelperText>
      <FormErrorMessage>
        {errors.feeAmmount && errors.feeAmmount.message}
      </FormErrorMessage>
    </FormControl>
  );
}

function MinSettlement({
  register,
  errors,
}: {
  register: UseFormRegister<FieldValues>;
  errors: any;
}) {
  return (
    <FormControl id="minSettlement" isRequired isInvalid={errors.minSettlement}>
      <FormLabel>Min Settlement</FormLabel>
      <Input
        type="number"
        {...register("minSettlement", {
          required: "This is required",
          min: { value: 1, message: "Minimum value should be 1" },
        })}
      />
      <FormHelperText>
        Please enter the smallest settlement ammount.
      </FormHelperText>
      <FormErrorMessage>
        {errors.minSettlement && errors.minSettlement.message}
      </FormErrorMessage>
    </FormControl>
  );
}

function MaxSettlement({
  register,
  errors,
}: {
  register: UseFormRegister<FieldValues>;
  errors: any;
}) {
  return (
    <FormControl id="maxSettlement" isRequired isInvalid={errors.maxSettlement}>
      <FormLabel>Max Settlement</FormLabel>
      <Input
        type="number"
        {...register("maxSettlement", {
          required: "This is required",
          min: { value: 1, message: "Minimum value should be 1" },
        })}
      />
      <FormHelperText>
        Please enter the largest settlement ammount.
      </FormHelperText>
      <FormErrorMessage>
        {errors.maxSettlement && errors.maxSettlement.message}
      </FormErrorMessage>
    </FormControl>
  );
}
