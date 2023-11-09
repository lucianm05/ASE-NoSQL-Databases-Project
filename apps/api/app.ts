require("dotenv").config();
import { config } from "config";
import cors from "cors";
import express, { Express } from "express";

import parkingLotRoutes from "./src/routes/parking-lot.route";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (origin !== config.WEB_URL)
        return callback(new Error("Not allowed by CORS"));

      return callback(null, true);
    },
  })
);

app.use("/parking-lot", parkingLotRoutes);

app.listen(config.API_PORT, async () => {
  console.log(`API started on port ${config.API_PORT}`);
});
