import { Request, Response, NextFunction } from 'express';
import { ITechnology } from '../interfaces/technologies.interfaces';
import { QueryResult } from 'pg';
import { client } from '../database';

const ensureTechnologyIsValid = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  const techs: string[] = ["JavaScript","Python","React","Express.js","HTML","CSS","Django","PostgreSQL","MongoDB"];
  let techData: string;

  if(req.route.path === '/projects/:id/technologies/:name'){
    techData = req.params.name
  } else {
    techData = req.body.name
  }
  
  if(!techs.includes(techData)){
    return res.status(400).json({
      message: "Technology not supported.",
      options: techs
    })
  }

  return next();
}

const ensureTechIsNotAssociatedWithProject = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const projectId: number = res.locals.project.id;
  const techName: string = req.body.name;

  const query: string = `
    SELECT *
    FROM projects_technologies pt
    JOIN technologies t
    ON pt."technologyId" = t.id
    JOIN projects p 
    ON p.id = pt."projectId"
    WHERE p.id = $1 AND t.name = $2;
  `
  const queryResult: QueryResult = await client.query(query, [projectId, techName]);

  if(queryResult.rowCount > 0 && req.route.path !== '/projects/:id/technologies/:name'){
    
    return res.status(409).json({
      message: "This technology is already associated with the project"
    })
  } 

  return next();
}

const ensureTechIsAssociatedToTheProject = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const projectId: number = res.locals.project.id;
  const techName: string = req.params.name;

  const query: string = `
    SELECT  *
    FROM technologies t
    JOIN projects_technologies pt
    ON t.id = pt."technologyId"
    WHERE pt."projectId" = $1 AND t."name" = $2;
  `
  const queryResult: QueryResult = await client.query(query, [projectId, techName])
  
  if(queryResult.rowCount === 0){
    return res.status(400).json({
      message: "Technology not related to the project."
    })
  }

  return next();
}

export {
  ensureTechnologyIsValid,
  ensureTechIsNotAssociatedWithProject,
  ensureTechIsAssociatedToTheProject
}