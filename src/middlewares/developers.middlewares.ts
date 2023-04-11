import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "../database";
import { IDeveloper, IDeveloperRequest } from "../interfaces/developers.interfaces";

const ensureEmailDoesNotExist = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const developerData: IDeveloperRequest = req.body;

  const query: string = `
    SELECT *
    FROM developers
    WHERE email = $1
  `

  const queryResult: QueryResult<IDeveloper> = await client.query(query, [developerData.email]);

  if(queryResult.rows.length !== 0){
    return res.status(409).json({
      message: "Email already exists."
    })
  }

  return next();
  
}

const ensureDeveloperExists = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const id: number = Number(req.params.id);
  const query = `
    SELECT *
    FROM developers
    WHERE id = $1;
  `;

  const queryResult: QueryResult<IDeveloper> = await client.query(query, [id]);

  if(queryResult.rows.length === 0){
    return res.status(404).json({
      message: "Developer not found."
    })
  };

  res.locals.developer = {
    id: id
  }

  return next();
}

export {
  ensureEmailDoesNotExist,
  ensureDeveloperExists
}