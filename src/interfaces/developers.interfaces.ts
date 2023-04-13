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

interface IDeveloperFullInfos {
  developerId: number,
  developerName: string,
  developerEmail: string,
  developerInfoDeveloperSince: Date | null,
  developerInfoPreferredOS: string | null
}

type TDeveloperInfosRequest = Omit<IDeveloperInfos, 'id'>

export {
  IDeveloperRequest,
  IDeveloper,
  IDeveloperInfos,
  TDeveloperInfosRequest,
  IDeveloperFullInfos
}