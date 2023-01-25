import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import {
  Button,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import ReactPaginate from "react-paginate";
import ShowEntries from "@/components/ShowEntries";
import SearchInput from "@/components/SearchInput";
import { BsChevronLeft, BsChevronRight, BsThreeDots } from "react-icons/bs";
import { Role } from "@/types/global";
import { addRoute, deleteRoute, getRoutes } from "@/api/route";
import { useUser } from "@/hooks/useUser";
import { api } from "@/lib/axios";
import ModalAddRoute from "./modal/ModalAddRoute";
import { RouteResponse } from "@/types/route";
import ModalDelete from "./ModalDelete";
type Props = {
  role: Role;
};
function RouterList({ role }: Props) {
  const { user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [idToAction, setIdtoAction] = useState<number | undefined>();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const {
    isOpen: isOpenRequest,
    onOpen: onOpenRequest,
    onClose: onCloseRequest,
  } = useDisclosure();
  const queryClient = useQueryClient();
  const toast = useToast({ position: "top-right", isClosable: true });
  const [idToDelete, setIdToDelete] = useState<number>(0);
  const [dataToRequest, setDataToRequest] = useState<
    RouteResponse | undefined
  >();
  const [keyword, setKeyword] = useState<string>("");
  const [size, setSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const keywordDebounced = useDebounce(keyword);
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["route", keywordDebounced, size, page],
    keepPreviousData: true,
    queryFn: () => getRoutes({ search: keywordDebounced, page, size }),
  });

  const { mutate: doDelete, isLoading: isLoadingDelete } =
    useMutation(deleteRoute);
  const { mutate: doRequest, isLoading: isLoadingRequest } = useMutation<
    any,
    any,
    any
  >(async (data) => await api.post("api/request", data));

  const handleDelete = (id: number) => {
    doDelete(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["route"] });
        onCloseDelete();
        toast({
          title: `Route deleted`,
          description: `Successfully delete route`,
          status: "success",
        });
      },
      onError: () => {
        onCloseDelete();
        queryClient.invalidateQueries({ queryKey: ["route"] });
        toast({
          title: `Error`,
          description: `Error delete route`,
          status: "error",
        });
      },
    });
  };

  isLoading && <Spinner />;
  isError && "error";
  return (
    <>
      <div className="flex justify-between mb-5 ">
        <h1 className="text-xl font-bold text-farmatek-black ">Route List</h1>

        <div className="flex space-x-3">
          {role === "admin" && (
            <button
              className="ml-3 bg-primary py-2 px-4 rounded-lg"
              onClick={onOpen}
            >
              + Add Route
            </button>
          )}
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
              <Th>Driver</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.data.map((e) => (
              <Tr key={e.id}>
                <Td>{e.destination}</Td>
                <Td>{e.departureTime}</Td>
                <Td>{e.capacity}</Td>
                <Td>{e.estimation}</Td>
                <Td>{e?.User.name}</Td>
                <Td className="flex space-x-1">
                  {(isLoadingDelete && idToAction === e.id) ||
                  (isLoadingRequest && idToAction === e.id) ? (
                    <Spinner />
                  ) : role === "admin" ? (
                    <>
                      <AiOutlineEye size={20} />
                      <AiOutlineEdit size={20} />
                      <AiOutlineDelete
                        size={20}
                        onClick={() => {
                          setIdtoAction(e.id);
                          onOpenDelete();
                          setIdToDelete(e.id);
                        }}
                        className="cursor-pointer"
                      />
                    </>
                  ) : (
                    <Button
                      size="sm"
                      backgroundColor={`${
                        e.status === 0
                          ? "blue"
                          : e.status === 1
                          ? "green"
                          : e.status === 2
                          ? "red"
                          : "#efdd41"
                      }`}
                      color={e.status !== null ? "white" : "black"}
                      onClick={() => {
                        setIdtoAction(e.id);
                        setDataToRequest(e);
                        onOpenRequest();
                      }}
                      isDisabled={e.status !== null}
                    >
                      {e.status === 0
                        ? "Wait to approve"
                        : e.status === 1
                        ? "Approved"
                        : e.status === 2
                        ? "Rejected"
                        : "Request"}
                    </Button>
                  )}
                </Td>
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
      <ModalAddRoute
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        addFunction={addRoute}
      />
      <ModalDelete
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onOpen={onOpenDelete}
        id={idToDelete}
        name="Route"
        handleDelete={handleDelete}
      />
      <Modal isOpen={isOpenRequest} onClose={onCloseRequest} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Driver</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure want to request driver?</ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseRequest}>
              Close
            </Button>
            <Button
              colorScheme={"yellow"}
              onClick={() => {
                doRequest(
                  { routeId: dataToRequest?.id, passengerId: user?.id },
                  {
                    onSuccess: () => {
                      onCloseRequest();
                      queryClient.invalidateQueries({ queryKey: ["route"] });
                      toast({
                        title: `Request success`,
                        description: `Successfully request driver`,
                        status: "success",
                      });
                    },
                    onError: () => {
                      onCloseRequest();
                      toast({
                        title: `Request failed`,
                        description: `Failed request driver`,
                        status: "success",
                      });
                    },
                  }
                );
              }}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default RouterList;
