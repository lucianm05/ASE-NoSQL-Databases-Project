import { collections, mongoClient } from "@/mongo";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { LocationPayload, ParkingLotPayload } from "types";
import { ZodTypeAny, z } from "zod";

const validateCreateData = (body: ParkingLotPayload, optional?: boolean) => {
  let schema = z.object<Record<keyof ParkingLotPayload, ZodTypeAny>>({
    capacity: z.number().min(1),
    fee: z.number(),
    name: z.string(),
    location: z.object<Record<keyof LocationPayload, ZodTypeAny>>({
      city: z.string(),
      country: z.string(),
      street: z.string(),
      shape: z.object({
        coordinates: z.array(z.number()),
      }),
    }),
  });

  if (optional) {
    schema = schema.deepPartial();
  }

  return schema.safeParse(body);
};

export const getParkingLots = async (req: Request, res: Response) => {
  try {
    const { bounds } = req.query;

    const filters: Record<string, any> = {};

    try {
      if (bounds && typeof bounds === "string") {
        const [ne, sw] = decodeURIComponent(bounds).split("&");

        const getCoords = (input: string) =>
          input
            .split("=")[1]
            .split(",")
            .map((c) => Number(c) || undefined);

        const [n, e] = getCoords(ne);
        const [s, w] = getCoords(sw);

        if (n && e && s && w) {
          filters["location.shape"] = {
            $geoWithin: {
              $box: [
                [n, e],
                [s, w],
              ],
            },
          };
        }
      }
    } catch (err) {
      console.error(err);
    }

    const parkingLots = await collections.parkingLots
      .aggregate([
        {
          $match: filters,
        },
        {
          $lookup: {
            from: "reservations",
            localField: "_id",
            foreignField: "parkingLotId",
            as: "reservations",
            pipeline: [
              {
                $match: { expiresAt: { $gt: new Date() } },
              },
            ],
          },
        },
        {
          $addFields: {
            occupiedSpaces: { $size: "$reservations" },
          },
        },
        {
          $project: {
            reservations: 0,
          },
        },
      ])
      .toArray();

    return res.status(200).json(parkingLots);
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: (err as Error).message });
  }
};

export const createParkingLot = async (req: Request, res: Response) => {
  try {
    const body: ParkingLotPayload = req.body;

    const validation = validateCreateData(body);

    if (!validation.success) {
      return res.status(400).json({ message: validation.error.flatten() });
    }

    const parkingLot = await collections.parkingLots.insertOne({
      ...body,
      location: {
        ...body.location,
        shape: {
          type: "Point",
          coordinates: body.location?.shape?.coordinates || [],
        },
      },
    });

    return res.status(200).json({ id: parkingLot.insertedId });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: (err as Error).message });
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
  }
};

export const reserveParkingLot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const objectId = new ObjectId(id);

    const parkingLot = await collections.parkingLots.findOne({
      _id: { $eq: objectId },
    });

    if (!parkingLot)
      return res
        .status(404)
        .json({ message: `Parking lot with id ${id} does not exist.` });

    const occupiedSpaces = await collections.reservations.countDocuments({
      parkingLotId: { $eq: objectId },
      expiresAt: { $gt: new Date() },
    });

    if (
      occupiedSpaces != undefined &&
      parkingLot.capacity != undefined &&
      occupiedSpaces >= parkingLot.capacity
    ) {
      return res
        .status(401)
        .json({ message: `Parking lot with id ${id} is at full capacity.` });
    }

    await collections.reservations.insertOne({
      parkingLotId: objectId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return res
      .status(200)
      .json({ message: "You have reserved the parking lot!" });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: (err as Error).message });
  }
};

export const deleteParkingLot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const objectId = new ObjectId(id);

    const parkingLot = await collections.parkingLots.findOne({
      _id: { $eq: objectId },
    });

    if (!parkingLot)
      return res
        .status(404)
        .json({ message: `Parking lot with id ${id} does not exist.` });

    await collections.parkingLots.deleteOne({ _id: { $eq: objectId } });
    await collections.reservations.deleteMany({
      parkingLotId: { $eq: objectId },
    });

    return res.status(200).json({ message: "Parking lot was deleted." });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: (err as Error).message });
  }
};
