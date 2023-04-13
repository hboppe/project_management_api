import { Request, Response } from "express"
import { QueryResult } from "pg";
import format from "pg-format";
import { client } from "../database";
import { IDeveloperRequest, IDeveloper, TDeveloperInfosRequest, IDeveloperInfos } from "../interfaces/developers.interfaces";

const createDeveloper = async (req: Request, res: Response): Promise<Response> => {
  const developerData: IDeveloperRequest = req.body;

  const query: string = format(`
      INSERT INTO developers (%I)
      VALUES (%L)
      RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
  );

  const queryResult: QueryResult<IDeveloper> = await client.query(query);


  return res.status(201).json(queryResult.rows[0]);
}

const updateDeveloper = async (req: Request, res: Response): Promise<Response> => {

  const id: number = res.locals.developer.id;

  const developerData: Partial<IDeveloper> = req.body;

  developerData.id ? delete developerData.id : null;

  const query: string = format(`
      UPDATE developers
      SET (%I) = ROW (%L)
      WHERE id = $1
      RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
  );

  const queryResult: QueryResult<IDeveloper> = await client.query(query, [id]);

  return res.status(200).json(queryResult.rows[0]);
}

const deleteDeveloper = async (req: Request, res: Response): Promise<Response> => {

  const id: number = res.locals.developer.id;

  const query: string = `
    DELETE FROM developers
    WHERE id = $1;
  `;

  await client.query(query, [id]);

  return res.status(204).json();
}

const createDeveloperInfos = async (req: Request, res: Response): Promise<Response> => {

  const id: number = res.locals.developer.id;
  const developerInfos: TDeveloperInfosRequest = {...req.body, developerId: id};
  console.log(developerInfos)

  const query: string = format(`
      INSERT INTO developer_infos(%I)
      VALUES (%L)
      RETURNING *;
    `,
    Object.keys(developerInfos),
    Object.values(developerInfos)
  );

  const queryResult: QueryResult<IDeveloperInfos> = await client.query(query);

  return res.status(201).json(queryResult.rows[0]);
}

const retrieveDeveloperById = async (req: Request, res: Response): Promise<Response> => {
  const id: number = Number(req.params.id);

  const query: string = `
    SELECT 
      d.id AS "developerId", 
      d."name" AS "developerName", 
      d.email AS "developerEmail",
      di."developerSince" AS "developerInfoDeveloperSince",
      di."preferredOS" AS "developerInfoPreferredOS"
    FROM developers d
    LEFT JOIN developer_infos di
    ON d.id = di."developerId"
    WHERE d.id = $1;
  `
  const queryResult: QueryResult = await client.query(query, [id]);

  return res.status(200).json(queryResult.rows[0]);
}

export {
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  createDeveloperInfos,
  retrieveDeveloperById
}