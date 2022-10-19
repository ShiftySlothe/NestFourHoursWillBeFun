import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import SelectUserRole from "../components/SelectUserRole";

type SignInModalProps = {
  setOpen: boolean;
};
export default function SignInModal({ setOpen }: SignInModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    if (setOpen) {
      onOpen();
    }
  }, [setOpen, onOpen]);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please Select a Role</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SelectUserRole />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
