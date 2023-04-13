import { Request, Response } from "express";
import { IProject, TProjectRequest, TProjectsUpdateRequest } from "../interfaces/projects.interfaces";
import format from 'pg-format';
import { QueryResult } from "pg";
import { client } from "../database";

const createProject = async (req: Request, res: Response): Promise<Response> => {

  const projectData: TProjectRequest = req.body;

  const query: string = format(`
      INSERT INTO projects (%I)
      VALUES (%L)
      RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData)
  )

  const queryResult: QueryResult<IProject> = await client.query(query);

  return res.status(201).json(queryResult.rows[0]);
}

const updateProject = async (req: Request, res: Response): Promise<Response> => {
  const projectData: TProjectsUpdateRequest = req.body;
  const id: number = res.locals.project.id;

  projectData.id ? delete projectData.id : null;

  const query: string = format(`
      UPDATE projects
      SET (%I) = ROW (%L)
      WHERE id = $1
      RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData)
  )

  const queryResult: QueryResult<IProject> = await client.query(query, [id]);
  
  return res.status(200).json(queryResult.rows[0]);
}

const deleteProject = async (req: Request, res: Response): Promise<Response> => {
  const id: number = res.locals.project.id;

  const query: string = `
    DELETE FROM projects
    WHERE id = $1;
  `
  await client.query(query, [id]);

  return res.status(204).json();
}

const associateTechToProject = async (req: Request, res: Response): Promise<Response> => {
  const projectId: number = res.locals.project.id;
  const technologyName: string = req.body.name;
  const date: Date = new Date();

  const queryInsert = `
      INSERT INTO projects_technologies ("addedIn", "projectId", "technologyId")
      VALUES ($1, $2, (SELECT id FROM technologies WHERE name = $3));
  `
  await client.query(queryInsert, [date, projectId, technologyName]);

  const querySelect: string = `
    SELECT 
      pt."technologyId", 
      t.name AS "technologyName", 
      pt."projectId", p.name AS "projectName", 
      p.description AS "projectDescription", 
      p."estimatedTime" AS "projectEstimatedTime", 
      p.repository AS "projectRepository", 
      p."startDate" AS "projectStartDate", 
      p."endDate" AS "projectEndDate"
    FROM projects_technologies pt
    JOIN technologies t
    ON pt."technologyId" = t.id
    JOIN projects p 
    ON p.id = pt."projectId"
    WHERE p.id = $1 AND t.name = $2;
  ` 
  const querySelectResult: QueryResult = await client.query(querySelect, [projectId, technologyName])
  
  return res.status(201).json(querySelectResult.rows[0]);
}

const retrieveProjectById = async (req: Request, res: Response): Promise<Response> => {
  const projectId: number = res.locals.project.id;

  const query: string = `
    SELECT 
      p.id AS "projectId",
      p."name" AS "projectName",
      p.description AS "projectDescription",
      p."estimatedTime" AS "projectEstimatedTime",
      p.repository AS "projectRepository",
      p."startDate" AS "projectStartDate",
      p."endDate" AS "projectEndDate",
      p."developerId" AS "projectDeveloperId",
      t.id AS "technologyId",
      t."name" AS "technologyName"
    FROM projects p
    LEFT JOIN projects_technologies pt
    ON p.id = pt."projectId"
    LEFT JOIN technologies t
    ON t.id = pt."technologyId"
    WHERE p.id = $1;
  `
  const queryResult: QueryResult = await client.query(query, [projectId]);

  return res.status(200).json(queryResult.rows);
}

export {
  createProject,
  updateProject,
  deleteProject,
  associateTechToProject,
  retrieveProjectById
}
