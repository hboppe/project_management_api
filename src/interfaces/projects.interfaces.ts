interface IProject {
  id: number,
  name: string,
  description: string,
  estimatedTime: string,
  repository: string,
  startDate: Date,
  endDate: Date,
  developerId: number
}

type TProjectRequest = Omit<IProject, 'id'>

type TProjectsUpdateRequest = Partial<IProject>

interface IProjectsAndTechInfos {
  technologyId: number,
  technologyName: string,
  projectId: number,
  projectName: string,
  projectDescription: string,
  projectEstimatedTime: string,
  projectRepository: string,
  projectStartDate: Date,
  projectEndDate: Date | null
}

export {
  IProject,
  TProjectRequest,
  TProjectsUpdateRequest,
  IProjectsAndTechInfos
}