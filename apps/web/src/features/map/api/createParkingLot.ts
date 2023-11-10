import dict from "@/constants/dict";
import queryKeys from "@/constants/query-keys";
import useAlert from "@/features/alert/alert.store";
import { useParkingLots } from "@/features/map/api/getParkingLots";
import { fetcher, FetchError } from "@/utils/fetcher";
import { useMutation, useQueryClient } from "react-query";
import { ParkingLotPayload } from "types";

export const createParkingLot = async (payload: ParkingLotPayload) => {
  const res = await fetcher<{ id: number }>("/parking-lot", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res;
};

export const useCreateParkingLot = () => {
  const alert = useAlert();
  const { refetch } = useParkingLots();

  return useMutation({
    mutationFn: createParkingLot,
    onSuccess: async (res) => {
      if (!res) return;
      await refetch();
      alert.success(dict.en.success);
    },
    onError: (error) => {
      if (!(error instanceof FetchError)) return;

      if (error.response.status === 400) {
        alert.error(dict.en.missing_or_invalid_values);
        return;
      }

      alert.error(error.data.message);
    },
  });
};
