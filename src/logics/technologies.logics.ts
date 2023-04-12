import { Request, Response } from "express"
import { QueryResult } from 'pg';
import { client } from "../database";

const deleteTechFromProject = async (req: Request, res: Response): Promise<Response> => {
  const techName: string = req.params.name;
  const projectId: number = res.locals.project.id;

  const query: string = `
    DELETE FROM projects_technologies pt
    WHERE pt."projectId" = $1 
    AND pt."technologyId" = (SELECT id FROM technologies t WHERE t.name = $2)
  `
  await client.query(query, [projectId, techName]);

  return res.status(204).json();
}

export {
  deleteTechFromProject
}