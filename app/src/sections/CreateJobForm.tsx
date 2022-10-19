import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";

export default function CreateJobForm() {
  const submitFormData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  };

  return (
    <Container>
      <Heading marginBottom={4}>Create a new job</Heading>
      <form onSubmit={submitFormData}>
        <TitleField />
        <DescriptionField />
        <Button marginTop={4} type="submit">
          Submit
        </Button>
      </form>
    </Container>
  );
}

function TitleField() {
  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);

  const isError = input === "";

  return (
    <FormControl id="title" isRequired>
      <FormLabel>Title</FormLabel>
      <Input type="text" value={input} onChange={handleInputChange} />
      {!isError ? (
        <FormHelperText>Please enter the title of the job.</FormHelperText>
      ) : (
        <FormErrorMessage>Job is required.</FormErrorMessage>
      )}
    </FormControl>
  );
}

function DescriptionField() {
  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);

  const isError = input === "";
  return (
    <FormControl id="description" isRequired>
      <FormLabel>Description</FormLabel>
      <Input type="email" value={input} onChange={handleInputChange} />
      {!isError ? (
        <FormHelperText>Please enter a description for the job.</FormHelperText>
      ) : (
        <FormErrorMessage>Description is required.</FormErrorMessage>
      )}
    </FormControl>
  );
}
