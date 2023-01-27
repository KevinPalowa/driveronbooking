import { AddUserBody } from "@/api/user";
import { ErrorResponse } from "@/types/global";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormValue = { email: string; name: string; password: string };
type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  addFunction: (params: AddUserBody) => Promise<any>;
  name: string;
};
export default function ModalAddDriver({
  isOpen,
  onOpen,
  onClose,
  addFunction,
  name,
}: Props) {
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit: submit,
    formState: { errors },
    reset,
  } = useForm<FormValue>();

  const toast = useToast({ position: "top-right", isClosable: true });

  const { mutate, error, isLoading, data } = useMutation<
    any,
    AxiosError<ErrorResponse>,
    any
  >(addFunction);
  const handleSubmit = (e: any) => {
    mutate(
      { ...e, role: name },
      {
        onSuccess: () => {
          reset();
          queryClient.invalidateQueries({ queryKey: [name] });
          onClose();

          toast({
            title: `${name} Added`,
            description: `Successfully add ${name}`,
            status: "success",
          });
        },
        onError: (e) => {
          reset();
          onClose();
          toast({
            title: `Add ${name}  failure`,
            description: e?.response?.data.message,
            status: "error",
          });
        },
      }
    );
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <form onSubmit={submit(handleSubmit)}>
          <ModalContent>
            <ModalHeader>Add Employee</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <SimpleGrid columns={1} spacingY={"2"}>
                <SimpleGrid columns={2}>
                  <Text>Email</Text>
                  <Input type="email" width="full" {...register("email")} />
                </SimpleGrid>
                <SimpleGrid columns={2}>
                  <Text>Name</Text>
                  <Input {...register("name")} />
                </SimpleGrid>
                <SimpleGrid columns={2}>
                  <Text>Password</Text>
                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      type={show ? "text" : "password"}
                      placeholder="Enter password"
                      {...register("password")}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShow(!show)}
                      >
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </SimpleGrid>
              </SimpleGrid>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button type="submit" colorScheme={"yellow"}>
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}
