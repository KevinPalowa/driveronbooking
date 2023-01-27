import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import {
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import ModalAddDriver from "@/components/ModalAddDriver";
import useDebounce from "@/hooks/useDebounce";
import ReactPaginate from "react-paginate";
import ShowEntries from "@/components/ShowEntries";
import SearchInput from "@/components/SearchInput";
import { BsChevronLeft, BsChevronRight, BsThreeDots } from "react-icons/bs";
import ModalDelete from "@/components/ModalDelete";
import { addUser, deleteUser, editUser, getUser } from "@/api/user";
import { Role } from "@/types/global";
import ModalEditUser from "./modal/ModalEditUser";
import { UserResponse } from "@/types/user";
import Link from "next/link";
type Props = {
  role: Role;
};
function UserList({ role }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const queryClient = useQueryClient();
  const toast = useToast({ position: "top-right", isClosable: true });
  const [idToDelete, setIdToDelete] = useState<number>(0);
  const [dataToEdit, setDataToEdit] = useState<UserResponse>();
  const [keyword, setKeyword] = useState<string>("");
  const [size, setSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const keywordDebounced = useDebounce(keyword);
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: [role, keywordDebounced, size, page],
    keepPreviousData: true,
    queryFn: () => getUser({ search: keywordDebounced, page, size, role }),
  });

  const { mutate: doDelete } = useMutation(deleteUser);

  const handleDelete = (id: number) => {
    doDelete(id, {
      onSuccess: () => {
        console.log("berhasil");
        queryClient.invalidateQueries({ queryKey: [role] });
        onCloseDelete();
        toast({
          title: `${role} deleted`,
          description: `Successfully delete ${role}`,
          status: "success",
        });
      },
      onError: () => {
        queryClient.invalidateQueries({ queryKey: [role] });
        onCloseDelete();
        toast({
          title: `${role} not deleted`,
          description: `Error delete ${role}`,
          status: "error",
        });
      },
    });
  };

  isError && "error";
  isLoading && <Spinner />;
  return (
    <>
      <div className="flex justify-between mb-5 ">
        <h1 className="text-xl font-bold text-farmatek-black capitalize">
          {role} List
        </h1>

        <div className="flex space-x-3">
          <button
            className="ml-3 bg-primary py-2 px-4 rounded-lg"
            onClick={onOpen}
          >
            + Add {role}
          </button>
          <SearchInput onChange={(e) => setKeyword(e.target.value)} />
        </div>
      </div>
      <ShowEntries setPage={setPage} setSize={setSize} />
      {isSuccess && (
        <>
          <TableContainer className="bg-white rounded-lg shadow-lg text-sm mt-5">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.data.map((e) => (
                  <Tr key={e.id}>
                    <Td>{e.name}</Td>
                    <Td>{e.email}</Td>
                    <Td className="flex space-x-1">
                      <Link href={`${role}/${e.id}`}>
                        <AiOutlineEye size={20} />
                      </Link>
                      <AiOutlineEdit
                        size={20}
                        className="cursor-pointer"
                        onClick={() => {
                          setDataToEdit(e);
                          onOpenEdit();
                        }}
                      />
                      <AiOutlineDelete
                        size={20}
                        onClick={() => {
                          onOpenDelete();
                          setIdToDelete(e.id);
                        }}
                        className="cursor-pointer"
                      />
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
            pageCount={data.meta.totalPage}
            previousLabel={<BsChevronLeft />}
          />
        </>
      )}

      <ModalEditUser
        isOpen={isOpenEdit}
        onOpen={onOpenEdit}
        onClose={onCloseEdit}
        name={role}
        dataToEdit={dataToEdit!}
        editFunction={editUser}
      />
      <ModalAddDriver
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        addFunction={addUser}
        name={role}
      />
      <ModalDelete
        name={role}
        isOpen={isOpenDelete}
        onOpen={onOpenDelete}
        onClose={onCloseDelete}
        id={idToDelete}
        handleDelete={handleDelete}
      />
    </>
  );
}

export default UserList;
