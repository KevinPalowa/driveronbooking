import { api } from "@/lib/axios";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
export default function RequestApproval() {
  const [idToApprove, setIdToApprove] = useState();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["request"],
    keepPreviousData: true,
    queryFn: async () => {
      const data = await api.get("api/request");
      return data.data;
    },
  });
  const { mutate, isLoading: isLoadingApproval } = useMutation<
    any,
    AxiosError<any>,
    any
  >((e) => api.patch("api/request/approval", e));
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
              <Th>Request by</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.data?.map((e: any) => (
              <Tr key={e.id}>
                <Td>{e.Route.destination}</Td>
                <Td>{e.User.name}</Td>
                <Td className="flex">
                  {isLoadingApproval && idToApprove === e.id ? (
                    <Spinner size="xs" />
                  ) : e.approved === 0 ? (
                    <>
                      <AiOutlineCheck
                        size={20}
                        color="green"
                        onClick={() => {
                          setIdToApprove(e.id);
                          mutate(
                            { requestId: e.id, action: "approve" },
                            {
                              onSuccess: () => {
                                queryClient.invalidateQueries(["request"]);
                              },
                            }
                          );
                        }}
                      />
                      <AiOutlineClose
                        size={20}
                        color="red"
                        onClick={() => {
                          setIdToApprove(e.id);
                          mutate(
                            { requestId: e.id, action: "reject" },
                            {
                              onSuccess: () => {
                                queryClient.invalidateQueries(["request"]);
                              },
                            }
                          );
                        }}
                      />
                    </>
                  ) : e.approved === 1 ? (
                    <div className="bg-green-500 rounded-lg p-2 text-white font-bold">
                      Approved
                    </div>
                  ) : (
                    e.approved === 2 && (
                      <div className="bg-red-500 rounded-lg p-2 text-white font-bold">
                        Rejected
                      </div>
                    )
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
