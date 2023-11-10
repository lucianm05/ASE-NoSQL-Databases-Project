import queryKeys from "@/constants/query-keys";
import { fetcher } from "@/utils/fetcher";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { ParkingLotDTO } from "types";

export const getParkingLots = async (query?: string) => {
  const res = await fetcher<ParkingLotDTO[]>(`/parking-lot?${query}`);
  return res.data;
};

export const useParkingLots = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.toString();

  return useQuery({
    queryFn: async () => await getParkingLots(query),
    queryKey: queryKeys.parkingLots.get(query),
    refetchOnWindowFocus: false,
    keepPreviousData: true
  });
};
