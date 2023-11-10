import { BaseEntity, Payload } from ".";

export interface LocationDTO extends BaseEntity {
  street?: string;
  city?: string;
  country?: string;
  shape?: {
    type?: "Point";
    coordinates?: number[];
  };
}

export interface LocationPayload extends Payload<LocationDTO> {}
