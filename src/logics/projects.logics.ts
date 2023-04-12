import { Request, Response } from "express";
import { IProject, TProjectRequest } from "../interfaces/projects.interfaces";
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

export {
  createProject
}
