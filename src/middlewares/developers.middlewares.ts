import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "../database";
import { IDeveloper, IDeveloperInfos, IDeveloperRequest, TDeveloperInfosRequest } from "../interfaces/developers.interfaces";

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

  let id:number;

  if(req.route.path.includes('/projects')){
    id= Number(req.body.developerId)
  } else {
    id= Number(req.params.id);
  }

  const query = `
    SELECT *
    FROM developers
    WHERE id = $1;
  `;

  const queryResult: QueryResult<IDeveloper> = await client.query(query, [id]);

  if(queryResult.rowCount === 0){
    return res.status(404).json({
      message: "Developer not found."
    })
  };

  res.locals.developer = {
    id: id
  }

  return next();
}

const ensureDeveloperDoesNotHaveInfos = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const id: number = Number(req.params.id);

  const query = `
    SELECT *
    FROM developer_infos
    WHERE "developerId" = $1;
  `
  const queryResult: QueryResult<IDeveloperInfos> = await client.query(query, [id]);

  if(queryResult.rowCount !== 0){
    return res.status(409).json({
      message: "Developer infos already exists."
    });
  }

  return next();

}

const ensureOSInformedIsValid = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  const developerInfos: TDeveloperInfosRequest = req.body;

  const osOptions = ['Windows', 'Linux', 'MacOS']

  if(!osOptions.includes(developerInfos.preferredOS)){
    return res.status(400).json({
      message: "Invalid OS option.",
      options: ["Windows", "Linux", "MacOS"]
    })
  }

  return next();
}

export {
  ensureEmailDoesNotExist,
  ensureDeveloperExists,
  ensureDeveloperDoesNotHaveInfos,
  ensureOSInformedIsValid
}