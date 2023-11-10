import dict from "@/constants/dict";
import { useDrawer } from "@/features/drawer/drawer.store";
import { ParkingLotForm } from "@/features/map/components/ParkingLotForm";
import { useMapStore } from "@/features/map/map.store";
import { useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router";

export const MapEvents = () => {
  const { setIsOpen, setConfig } = useDrawer();
  const { setMarkerPosition } = useMapStore();
  const navigate = useNavigate();

  const map = useMapEvents({
    click(event) {
      map.setView(event.latlng);

      setMarkerPosition([event.latlng.lat, event.latlng.lng]);

      setConfig({
        header: dict.en.add_new_parking_lot,
        body: (
          <ParkingLotForm
            location={{
              shape: {
                type: "Point",
                coordinates: [event.latlng.lng, event.latlng.lat],
              },
            }}
          />
        ),
        onClose: () => setMarkerPosition(undefined),
      });
      setIsOpen(true);
    },

    dragend() {
      const bounds = map.getBounds();

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const search = new URLSearchParams({
        bounds: new URLSearchParams({
          ne: `${ne.lng},${ne.lat}`,
          sw: `${sw.lng},${sw.lat}`,
        }).toString(),
      });

      navigate({ pathname: "/", search: search.toString() });
    },
  });

  return null;
};
