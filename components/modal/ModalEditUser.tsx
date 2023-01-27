import { ErrorResponse } from "@/types/global";
import { UserResponse } from "@/types/user";
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
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormValue = { email: string; name: string };

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  editFunction: (params: any) => Promise<any>;
  name: string;
  dataToEdit: UserResponse;
};
export default function ModalEditDriver({
  isOpen,
  onOpen,
  onClose,
  editFunction,
  name,
  dataToEdit,
}: Props) {
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit: submit,
    formState: { errors },
  } = useForm<FormValue>({
    values: { name: dataToEdit?.name, email: dataToEdit?.email },
  });

  const toast = useToast({ position: "top-right", isClosable: true });

  const { mutate } = useMutation<any, AxiosError<ErrorResponse>, FormValue>(
    (e) => editFunction({ ...e, id: dataToEdit.id })
  );
  const handleSubmit = (e: any) => {
    console.log(e);
    mutate(
      { ...e, role: name },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [name] });
          onClose();

          toast({
            title: `${name} Added`,
            description: `Successfully edit ${name}`,
            status: "success",
          });
        },
        onError: (e) => {
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
            <ModalHeader>Edit {name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <SimpleGrid columns={1} spacingY={"2"}>
                <SimpleGrid columns={2}>
                  <Text>Email</Text>
                  <Input type="email" {...register("email")} />
                </SimpleGrid>
                <SimpleGrid columns={2}>
                  <Text>Name</Text>
                  <Input {...register("name")} />
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
