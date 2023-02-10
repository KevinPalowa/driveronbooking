import React, { useState } from "react";
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
import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getRouteById } from "@/api/route";
function RouteDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["routeDetail", id],
    keepPreviousData: true,
    queryFn: () => getRouteById({ id: Number(id) }),
  });
  return (
    <Layout>
      {isSuccess && (
        <>
          <div className="bg-white rounded-lg shadow-lg text-sm mt-5 px-5 py-5">
            <h1 className="font-bold text-lg">Route Detail</h1>
            <div className="flex w-full mt-5">
              <div className="flex w-1/3 space-x-2">
                <p className="font-bold ">Destination:</p>
                <p>{data.data.destination}</p>
              </div>
              <div className="flex w-1/3 space-x-2">
                <p className="font-bold ">Departure Time</p>
                <p>{data.data.departureTime}</p>
              </div>
              <div className="flex w-1/3 space-x-2">
                <p className="font-bold">Capacity</p>
                <p>{data.data.capacity}</p>
              </div>
            </div>
            <div className="flex w-full mt-3">
              <div className="flex w-1/3 space-x-2">
                <p className="font-bold ">Estimation:</p>
                <p>{data.data.estimation}</p>
              </div>
              <div className="flex w-1/3 space-x-2">
                <p className="font-bold ">Driver</p>
                <p>{data.data.User.name}</p>
              </div>
              <div className="flex w-1/3 space-x-2">
                <p className="font-bold">Total passenger</p>
                <p>{data.data._count.passenger}</p>
              </div>
            </div>
          </div>
          <TableContainer className="bg-white rounded-lg shadow-lg text-sm mt-5">
            <h1 className="text-lg font-bold ml-6 my-3">Passenger List</h1>
            {data.data.passenger.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.data.passenger.map((e) => (
                    <>
                      <Td>{e.User.name}</Td>
                      <Td>{e.User.email}</Td>
                    </>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <p className="text-center font-bold mb-5">No Passenger</p>
            )}
          </TableContainer>
        </>
      )}
    </Layout>
  );
}

export default RouteDetail;
