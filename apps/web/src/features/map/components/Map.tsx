import { BUCHAREST_COORDS } from "@/constants";
import { MapEvents } from "@/features/map/components/MapEvents";
import { Markers } from "@/features/map/components/Markers";
import { useMapStore } from "@/features/map/map.store";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

export const Map = () => {
  const { markerPosition } = useMapStore();

  return (
    <div id="map" className="h-screen w-full">
      <MapContainer
        center={[BUCHAREST_COORDS.lat, BUCHAREST_COORDS.lng]}
        zoom={12}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEvents />

        <Markers />

        {markerPosition && <Marker position={markerPosition} />}
      </MapContainer>
    </div>
  );
};
