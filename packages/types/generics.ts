import { BaseEntity } from ".";

export type Payload<T extends BaseEntity> = Omit<T, "_id" | "createdAt">;
