import { LocationDTO, BaseEntity, Payload, LocationPayload } from ".";

export interface ParkingLotDTO extends BaseEntity {
  name?: string;
  capacity?: number;
  occupiedSpaces?: number;
  fee?: number;
  location?: LocationDTO;
}

export interface ParkingLotPayload
  extends Payload<Omit<ParkingLotDTO, "occupiedSpaces" | "location">> {
  location?: LocationPayload;
}
