import { Request, Response } from "express"
import { QueryResult } from "pg";
import format from "pg-format";
import { client } from "../database";
import { IDeveloperRequest, IDeveloper } from "../interfaces/developers.interfaces";

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


  return res.status(201).json(queryResult.rows[0])
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

export {
  createDeveloper,
  updateDeveloper
}