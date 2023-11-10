import dict from "@/constants/dict";
import useAlert from "@/features/alert/alert.store";
import { useParkingLots } from "@/features/map/api/getParkingLots";
import { MessageResponse } from "@/types";
import { fetcher, FetchError } from "@/utils/fetcher";
import { useMutation } from "react-query";

export const deleteParkingLot = async (id: string) => {
  const res = await fetcher<MessageResponse>(`/parking-lot/${id}`, {
    method: "DELETE",
  });
  return res;
};

export const useDeleteParkingLot = () => {
  const alert = useAlert();
  const { refetch } = useParkingLots();

  return useMutation({
    mutationFn: deleteParkingLot,
    onSuccess: async (res) => {
      if (!res) return;
      await refetch();
      alert.success(dict.en.success);
    },
    onError: (error) => {
      console.error(error);
      if (!(error instanceof FetchError)) return;
      alert.error(error.data.message);
    },
  });
};
