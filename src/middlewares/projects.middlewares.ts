import { NextFunction, Request, Response } from "express"
import { QueryResult } from 'pg';
import { client } from "../database";
import { IProject } from "../interfaces/projects.interfaces";

const ensureProjectExists = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const id: number = Number(req.params.id);

  const query: string = `
    SELECT *
    FROM projects
    WHERE id = $1;
  `
  const queryResult: QueryResult<IProject> = await client.query(query, [id]);

  if(queryResult.rowCount === 0){

    return res.status(404).json({
      message: "Project not found."
    })
  }

  res.locals.project = {
    id: id
  }

  return next();

}

export {
  ensureProjectExists,
}