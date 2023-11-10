import { Button } from "@/components/Button";
import dict from "@/constants/dict";
import { useDrawer } from "@/features/drawer/drawer.store";
import { useParkingLots } from "@/features/map/api/getParkingLots";
import { useReserverParkingLot } from "@/features/map/api/reserveParkingLot";
import { ParkingLotForm } from "@/features/map/components/ParkingLotForm";
import { useMapStore } from "@/features/map/map.store";
import { useCallback } from "react";
import { Marker, useMap } from "react-leaflet";
import { ParkingLotDTO } from "types";

export const Markers = () => {
  const { data: parkingLots = [] } = useParkingLots();
  const { setConfig, setIsOpen } = useDrawer();
  const { setMarkerPosition } = useMapStore();
  const map = useMap();

  const { mutateAsync: reserveParkingLot } = useReserverParkingLot();

  const onReserve = async (parkingLot: ParkingLotDTO) => {
    if (!parkingLot._id) return;
    await reserveParkingLot(parkingLot._id, {
      onSuccess: () => setIsOpen(false),
    });
  };

  const onMarkerClick = useCallback((parkingLot: ParkingLotDTO) => {
    if (!parkingLot?.location?.shape?.coordinates) return;

    setMarkerPosition(undefined);

    const [lng, lat] = parkingLot.location.shape.coordinates;

    map.setView([lat, lng]);

    setConfig({
      header: dict.en.manage_parking_lot,
      body: <ParkingLotForm parkingLot={parkingLot} />,
      footer: (
        <div className="flex w-full items-center justify-between">
          <span className="text-sm">
            {parkingLot.occupiedSpaces || 0}/{parkingLot.capacity}{" "}
            {dict.en.occupied_spaces}
          </span>

          <Button onClick={() => onReserve(parkingLot)}>
            {dict.en.reserve}
          </Button>
        </div>
      ),
    });
    setIsOpen(true);
  }, []);

  return (
    <>
      {parkingLots.map((parkingLot) => {
        if (!parkingLot?.location?.shape?.coordinates?.length) return null;

        const [lng, lat] = parkingLot.location.shape.coordinates;

        return (
          <Marker
            key={parkingLot._id}
            position={[lat, lng]}
            eventHandlers={{
              click: () => onMarkerClick(parkingLot),
            }}
          />
        );
      })}
    </>
  );
};
