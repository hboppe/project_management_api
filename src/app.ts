import express, { Application } from "express";
import "dotenv/config";
import { ensureDeveloperDoesNotHaveInfos, ensureDeveloperExists, ensureEmailDoesNotExist, ensureOSInformedIsValid } from "./middlewares/developers.middlewares";
import { createDeveloper, createDeveloperInfos, deleteDeveloper, updateDeveloper } from "./logics/developers.logics";
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
  ensureEmailDoesNotExist,
  updateDeveloper
);

app.delete(
  '/developers/:id',
  ensureDeveloperExists,
  deleteDeveloper
)

app.post(
  '/developers/:id/infos',
  ensureDeveloperExists,
  ensureDeveloperDoesNotHaveInfos,
  ensureOSInformedIsValid,
  createDeveloperInfos
)

export default app;
