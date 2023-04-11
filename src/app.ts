import express, { Application } from "express";
import "dotenv/config";
import { ensureDeveloperExists, ensureEmailDoesNotExist } from "./middlewares/developers.middlewares";
import { createDeveloper } from "./logics/developers.logics";
import { startDatabase } from "./database";

const app: Application = express();

app.use(express.json());

// app.listen(3000, async () => {
//   await startDatabase();
//   console.log('Server is running')
// });

app.post(
  '/developers',
  ensureEmailDoesNotExist,
  createDeveloper
);

app.patch(
  '/developers/:id',
  ensureDeveloperExists,
  ensureEmailDoesNotExist
);

export default app;
