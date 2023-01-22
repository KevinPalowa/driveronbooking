import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
export default function RequestApproval() {
  const data = [
    { id: "2", name: "Ucup sakucup", destination: "Neraka jahanam" },
  ];
  return (
    <>
      <h1 className="text-xl font-bold text-farmatek-black mb-5">
        Request approval employee
      </h1>
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
            {data?.map((e) => (
              <Tr key={e.id}>
                <Td>{e.name}</Td>
                <Td>{e.destination}</Td>
                <Td>{e.name}</Td>
                <Td className="flex">
                  <AiOutlineCheck size={20} color="green" />
                  <AiOutlineClose size={20} color="red" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
