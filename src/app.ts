import express, { Application } from "express";
import "dotenv/config";
import { ensureDeveloperDoesNotHaveInfos, ensureDeveloperExists, ensureEmailDoesNotExist, ensureOSInformedIsValid } from "./middlewares/developers.middlewares";
import { createDeveloper, createDeveloperInfos, deleteDeveloper, retrieveDeveloperById, updateDeveloper } from "./logics/developers.logics";
import { associateTechToProject, createProject, deleteProject, retrieveProjectById, updateProject } from "./logics/projects.logics";
import { ensureProjectExists } from "./middlewares/projects.middlewares";
import { ensureTechIsNotAssociatedWithProject, ensureTechIsAssociatedToTheProject, ensureTechnologyIsValid } from "./middlewares/technologies.middlewares";
import { deleteTechFromProject } from "./logics/technologies.logics";

const app: Application = express();

app.use(express.json());

app.post(
  '/developers',
  ensureEmailDoesNotExist,
  createDeveloper
);

app.get(
  '/developers/:id',
  ensureDeveloperExists,
  retrieveDeveloperById
)

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

app.get(
  '/projects/:id',
  ensureProjectExists,
  retrieveProjectById
)

app.post(
  '/projects/:id/technologies',
  ensureProjectExists,
  ensureTechnologyIsValid,
  ensureTechIsNotAssociatedWithProject,
  associateTechToProject
)

app.delete(
  '/projects/:id/technologies/:name',
  ensureProjectExists,
  ensureTechnologyIsValid,
  ensureTechIsAssociatedToTheProject,
  deleteTechFromProject
)

export default app;
