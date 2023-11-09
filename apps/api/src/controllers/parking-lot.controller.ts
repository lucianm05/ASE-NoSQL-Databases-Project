import Location from "@/models/location.model";
import ParkingLot from "@/models/parking-lot.model";
import { Request, Response } from "express";
import { LocationPayload, ParkingLotPayload } from "types";
import { z, ZodTypeAny } from "zod";
import { mongoClient, collections } from "@/mongo";
import { ObjectId } from "mongodb";

const validateCreateData = (body: ParkingLotPayload, optional?: boolean) => {
  let schema = z.object<Record<keyof ParkingLotPayload, ZodTypeAny>>({
    capacity: z.number().min(1),
    fee: z.number(),
    name: z.string(),
    location: z.object<Record<keyof LocationPayload, ZodTypeAny>>({
      city: z.string(),
      country: z.string(),
      lat: z.number(),
      lng: z.number(),
      street: z.string(),
    }),
  });

  if (optional) {
    schema = schema.deepPartial();
  }

  return schema.safeParse(body);
};

export const getParkingLots = async (req: Request, res: Response) => {
  try {
    await mongoClient.connect();

    const parkingLots = await collections.parkingLots.find().toArray();

    return res.status(200).json(parkingLots);
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: (err as Error).message });
  } finally {
    await mongoClient.close();
  }
};

export const createParkingLot = async (req: Request, res: Response) => {
  try {
    const body: ParkingLotPayload = req.body;

    const validation = validateCreateData(body);

    if (!validation.success) {
      return res.status(400).json({ message: validation.error.flatten() });
    }

    await mongoClient.connect();

    const parkingLot = await collections.parkingLots.insertOne(body);

    return res.status(200).json({ id: parkingLot.insertedId });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: (err as Error).message });
  } finally {
    await mongoClient.close();
  }
};

export const editParkingLot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body: ParkingLotPayload = req.body;

    const validation = validateCreateData(body, true);

    if (!validation.success) {
      return res.status(400).json({ message: validation.error.flatten() });
    }

    await mongoClient.connect();

    const objectId = new ObjectId(id);

    const parkingLot = await collections.parkingLots.findOne({
      _id: { $eq: objectId },
    });

    if (!parkingLot)
      return res
        .status(404)
        .json({ message: `Parking lot with id ${id} does not exist.` });

    await collections.parkingLots.updateOne(
      { _id: { $eq: objectId } },
      { $set: body }
    );

    return res.status(200).json({ message: "The parking lot was updated." });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: (err as Error).message });
  } finally {
    mongoClient.close();
  }
};

export const reserveParkingLot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await mongoClient.connect();

    const objectId = new ObjectId(id);

    const parkingLot = await collections.parkingLots.findOne({
      _id: { $eq: objectId },
    });

    if (!parkingLot)
      return res
        .status(404)
        .json({ message: `Parking lot with id ${id} does not exist.` });

    if (
      parkingLot.occupiedSpaces != undefined &&
      parkingLot.capacity != undefined &&
      parkingLot.occupiedSpaces >= parkingLot.capacity
    ) {
      return res
        .status(401)
        .json({ message: `Parking lot with id ${id} is at full capacity.` });
    }

    await collections.parkingLots.updateOne(
      { _id: { $eq: objectId } },
      {
        $inc: {
          occupiedSpaces: 1,
        },
      }
    );

    return res
      .status(200)
      .json({ message: "You have reserved the parking lot!" });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: (err as Error).message });
  } finally {
    await mongoClient.close();
  }
};

export const deleteParkingLot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await mongoClient.connect();

    const objectId = new ObjectId(id);

    const parkingLot = await collections.parkingLots.findOne({
      _id: { $eq: objectId },
    });

    if (!parkingLot)
      return res
        .status(404)
        .json({ message: `Parking lot with id ${id} does not exist.` });

    await collections.parkingLots.deleteOne({ _id: { $eq: objectId } });

    return res.status(200).json({ message: "Parking lot was deleted." });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: (err as Error).message });
  } finally {
    await mongoClient.close();
  }
};
