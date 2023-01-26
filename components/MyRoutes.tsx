import ShowEntries from "./ShowEntries";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import SearchInput from "@/components/SearchInput";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight, BsThreeDots } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { getMyRoutes } from "@/api/route";
import { useUser } from "@/hooks/useUser";

export default function MyRoutes() {
  const [keyword, setKeyword] = useState("");
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const { user } = useUser();
  const { data } = useQuery({
    queryKey: ["myRoute"],
    queryFn: () => getMyRoutes(user?.id!),
  });
  return (
    <>
      <div className="flex justify-between mb-5 ">
        <h1 className="text-xl font-bold text-farmatek-black ">Route List</h1>

        <div className="flex space-x-3">
          <SearchInput onChange={(e) => setKeyword(e.target.value)} />
        </div>
      </div>
      <ShowEntries setPage={setPage} setSize={setSize} />
      <TableContainer className="bg-white rounded-lg shadow-lg text-sm mt-5">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Destination</Th>
              <Th>Departure Time</Th>
              <Th>Capacity</Th>
              <Th>Estimation</Th>
              {false && (
                <>
                  <Th>Driver</Th>
                  <Th>Status</Th>
                </>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {data?.data.map((e) => (
              <Tr key={e.id}>
                <Td>{e.destination}</Td>
                <Td>{e.departureTime}</Td>
                <Td>{e.capacity}</Td>
                <Td>{e.estimation}</Td>
                {user?.role === "employee" && (
                  <>
                    <Td>{e?.User?.name}</Td>
                    <Td>
                      <Box
                        color="white"
                        className="rounded-lg py-2 text-center"
                        backgroundColor={`${
                          e?.passenger[0].approved === 0
                            ? "blue"
                            : e?.passenger[0].approved === 1
                            ? "green"
                            : "red"
                        }
`}
                      >
                        {e?.passenger[0].approved === 0
                          ? "Wait To Approve"
                          : e?.passenger[0].approved === 1
                          ? "Approved"
                          : "Rejected"}
                      </Box>
                    </Td>
                  </>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <ReactPaginate
        breakLabel={<BsThreeDots />}
        nextLabel={<BsChevronRight />}
        onPageChange={({ selected }) => {
          setPage(selected + 1);
        }}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        containerClassName="flex justify-center items-center text-sm mt-5 space-x-2"
        breakClassName="rounded-full px-2 py-1 bg-white shadow focus:outline-none"
        pageLinkClassName="rounded-full px-2 py-1 bg-white shadow focus:outline-none"
        activeLinkClassName="bg-primary"
        pageCount={data?.meta?.totalPage as number}
        previousLabel={<BsChevronLeft />}
      />
    </>
  );
}
