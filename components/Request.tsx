import { getRoutes } from "@/api/route";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
export default function Request() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = useQuery({
    queryKey: ["routes"],
    queryFn: () => getRoutes(),
  });
  console.log(data);
  return (
    <>
      <TableContainer className="bg-white rounded-lg shadow-lg text-sm">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Destination</Th>
              <Th>Email</Th>
              <Th>Request by</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Test</Td>
              <Td>test</Td>
              <Td>test</Td>
              <Td className="flex">
                <Button
                  size="sm"
                  backgroundColor="#efdd41"
                  onClick={() => onOpen()}
                >
                  Request
                </Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Driver</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure want to request driver?</ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme={"yellow"}>Yes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
