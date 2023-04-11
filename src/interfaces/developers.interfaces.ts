interface IDeveloperRequest {
  name: string,
  email: string
}

interface IDeveloper extends IDeveloperRequest {
  id: number
}

export {
  IDeveloperRequest,
  IDeveloper
}