import { getUser } from "@/api/user";
import { AddRouteBody, RouteResponse } from "@/types/route";
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
  Select,
} from "@chakra-ui/react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  editFunction: (id: number, obj: AddRouteBody) => Promise<any>;
  data: RouteResponse;
};
export default function ModalEditRoute({
  isOpen,
  onOpen,
  onClose,
  data,
  editFunction,
}: Props) {
  console.log(data);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit: submit,
    reset,
  } = useForm<AddRouteBody>({
    values: {
      capacity: data.capacity,
      driverId: data.User.id,
      estimation: data.estimation,
      destination: data.destination,
      departureTime: data.departureTime,
    },
  });
  const { data: dataDriver } = useQuery({
    queryKey: ["driver"],
    keepPreviousData: true,
    queryFn: () =>
      getUser({
        search: "",
        page: 1,
        size: 999999,
        role: "driver",
      }),
  });

  const toast = useToast({ position: "top-right", isClosable: true });

  const { mutate } = useMutation<any, AxiosError<any>, AddRouteBody>((e) =>
    editFunction(data.id, { ...e })
  );
  const handleSubmit = (e: AddRouteBody) => {
    console.log(e);
    mutate(
      { ...e },
      {
        onSuccess: () => {
          reset();
          queryClient.invalidateQueries({ queryKey: ["route"] });
          onClose();

          toast({
            title: `Route edited`,
            description: `Successfully edit route`,
            status: "success",
          });
        },
        onError: (e) => {
          console.log(e);
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
            <ModalHeader>Add Employee</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <SimpleGrid columns={1} spacingY={"2"}>
                <SimpleGrid columns={2}>
                  <Text>Destination</Text>
                  <Input {...register("destination")} />
                </SimpleGrid>
                <SimpleGrid columns={2}>
                  <Text>Time</Text>
                  <Input type="time" {...register("departureTime")} />
                </SimpleGrid>
                <SimpleGrid columns={2}>
                  <Text>Capacity</Text>
                  <Input type="number" {...register("capacity")} />
                </SimpleGrid>
                <SimpleGrid columns={2}>
                  <Text>Estimation</Text>
                  <Input {...register("estimation")} />
                </SimpleGrid>
                <SimpleGrid columns={2}>
                  <Text>Driver</Text>
                  <Select {...register("driverId")}>
                    {dataDriver?.data.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </Select>
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
