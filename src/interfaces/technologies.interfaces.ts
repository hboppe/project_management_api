interface ITechnology {
  name: "JavaScript"|"Python"|"React"|"Express.js"|"HTML"|"CSS"|"Django"|"PostgreSQL"|"MongoDB"
}

interface ITechProject {
  technologyId: number,
  technologyName: string,
  projectId: number
}

export {
  ITechnology,
  ITechProject
}