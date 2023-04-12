import express, { Application } from "express";
import "dotenv/config";
import { ensureDeveloperDoesNotHaveInfos, ensureDeveloperExists, ensureEmailDoesNotExist, ensureOSInformedIsValid } from "./middlewares/developers.middlewares";
import { createDeveloper, createDeveloperInfos, deleteDeveloper, updateDeveloper } from "./logics/developers.logics";
import { associateTechToProject, createProject, deleteProject, updateProject } from "./logics/projects.logics";
import { ensureProjectExists } from "./middlewares/projects.middlewares";
import { checkIfTechIsAssociatedWithProject, ensureTechnologyIsValid } from "./middlewares/technologies.middlewares";
import { deleteTechFromProject } from "./logics/technologies.logics";

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

app.post(
  '/projects',
  ensureDeveloperExists,
  createProject
)

app.patch(
  '/projects/:id',
  ensureProjectExists,
  ensureDeveloperExists,
  updateProject
)

app.delete(
  '/projects/:id',
  ensureProjectExists,
  deleteProject
)

app.get( // continuar
  '/projects/:id',
  ensureProjectExists
)

app.post(
  '/projects/:id/technologies/:name',
  ensureProjectExists,
  ensureTechnologyIsValid,
  checkIfTechIsAssociatedWithProject,
  associateTechToProject
)

app.delete(
  '/projects/:id/technologies/:name',
  ensureProjectExists,
  ensureTechnologyIsValid,
  checkIfTechIsAssociatedWithProject,
  deleteTechFromProject
)

export default app;
