import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  useToast,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  id: number;
  name: string;
  handleDelete: (id: number) => void;
};
export default function ModalDelete({
  isOpen,
  onOpen,
  onClose,
  id,
  name,
  handleDelete,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete {name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure want to delete?</ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => handleDelete(id)} colorScheme={"yellow"}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
