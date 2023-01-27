import {
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getUserById } from "@/api/user";
import { useRouter } from "next/router";
import { Role } from "@prisma/client";
function UserDetail({ role }: { role: Role }) {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["userDetail", id],
    keepPreviousData: true,
    queryFn: () => getUserById(Number(id)),
  });

  isError && "error";
  isLoading && <Spinner />;
  return (
    <>
      <h1 className="text-lg font-bold">
        {role === "driver" ? "Assigned Route" : `${data?.data.name} route`}
      </h1>
      {isSuccess && role === "driver" ? (
        <>
          <TableContainer className="bg-white rounded-lg shadow-lg text-sm mt-5">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Destination</Th>
                  <Th>Estimation</Th>
                  <Th>Capacity</Th>
                  <Th>Departure Time</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.data.routes.map((e) => (
                  <Tr key={e.id}>
                    <Td>{e.destination}</Td>
                    <Td>{e.estimation}</Td>
                    <Td>{e.capacity}</Td>
                    <Td>{e.departureTime}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <TableContainer className="bg-white rounded-lg shadow-lg text-sm mt-5">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Destination</Th>
                <Th>Estimation</Th>
                <Th>Departure Time</Th>
                <Th>Driver name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.data.RouteRequested.map((e) => (
                <Tr key={e.id}>
                  <Td>{e.Route.destination}</Td>
                  <Td>{e.Route.estimation}</Td>
                  <Td>{e.Route.departureTime}</Td>
                  <Td>{e.Route.User.name}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default UserDetail;
