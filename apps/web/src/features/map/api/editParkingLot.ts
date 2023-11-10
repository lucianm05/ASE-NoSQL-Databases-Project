import dict from "@/constants/dict";
import queryKeys from "@/constants/query-keys";
import useAlert from "@/features/alert/alert.store";
import { useParkingLots } from "@/features/map/api/getParkingLots";
import { MessageResponse } from "@/types";
import { fetcher, FetchError } from "@/utils/fetcher";
import { useMutation, useQueryClient } from "react-query";
import { ParkingLotPayload } from "types";

interface EditParkingLotPayload extends ParkingLotPayload {
  _id: string;
}

export const editParkingLot = async (payload: EditParkingLotPayload) => {
  const res = await fetcher<MessageResponse>(`/parking-lot/${payload._id}`, {
    method: "PUT",
    body: JSON.stringify({ ...payload, _id: undefined }),
  });
  return res;
};

export const useEditParkingLot = () => {
  const alert = useAlert();

  const { refetch } = useParkingLots();

  return useMutation({
    mutationFn: editParkingLot,
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
