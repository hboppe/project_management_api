interface IDeveloperRequest {
  name: string,
  email: string
}

interface IDeveloper extends IDeveloperRequest {
  id: number
}

interface IDeveloperInfos {
  id: number,
  developerSince: Date,
  preferredOS: 'Windows'|'Linux'|'MacOS',
  developerId: number
}

type TDeveloperInfosRequest = Omit<IDeveloperInfos, 'id'>

export {
  IDeveloperRequest,
  IDeveloper,
  IDeveloperInfos,
  TDeveloperInfosRequest
}