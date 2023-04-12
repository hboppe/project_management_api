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

export {
  IProject,
  TProjectRequest,
  TProjectsUpdateRequest
}