import { create } from "zustand";

type MarkerPosition = [number, number];

interface MapStore {
  markerPosition: MarkerPosition | undefined;
  setMarkerPosition: (pos: MarkerPosition | undefined) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  markerPosition: undefined,
  setMarkerPosition: (markerPosition) => set(() => ({ markerPosition })),
}));
