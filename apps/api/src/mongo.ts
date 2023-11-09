import { MongoClient, ServerApiVersion } from "mongodb";

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/parking`;

const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = mongoClient.db("parking");

const collections = {
  parkingLots: db.collection("parking-lots"),
};

export { mongoClient, db, collections };
