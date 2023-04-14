# **Manage projects**

This API Rest project that helps manage a company's developer information and keeps track of who's working on which projects and what technologies are being used for specific projects.

I used many-to-many relationship tables in the API to allow a project to have multiple techs associated with it. I also made sure to define the behavior of tables when info from a related foreign key is deleted, using the ON DELETE feature from PostgreSQL.

To make the API more user-friendly, I included custom query returns that join info from various tables connected by foreign keys, using JOIN operations.

Here are the technologies I used for this project:

- Node.js
- TypeScript
- pg
- pg-format
- PostgreSQL
- Jest

## Endpoints

| Method | Endpoint              | Responsabilities                                    |
| ------ | --------------------- | --------------------------------------------------- |
| POST   | /developers           | Create a new developer                              |
| GET    | /developers/:id       | List a developer and their informations             |
| PATCH  | /developers/:id       | Update developer's informations.                    |
| DELETE | /developers/:id       | Delete a developer.                                 |
| POST   | /developers/:id/infos | Create developer information                        |


### **POST /developers**

- Create a new developer with email and name information
 
### Examples

  ```json
  {
    "email": "fabio.jr@kenzie.com.br",
    "name": "Fabio"
  }
  ```

  - **Creating a developer with sucess**:

    ```json
    {
      "id": 1,
      "name": "Fabio",
      "email": "fabio.jr@github.com.br"
    }
    ```

  - **Creating a developer with an email already in database**:

    ```json
    {
      "message": "Email already exists."
    }
    ```

#

### **GET /developers/:id**

- Retrieve developer information:

### Examples

- **Retrieving developer information successfully**:

    ```json
    {
      "developerId": 1,
      "developerName": "Fabio",
      "developerEmail": "fabio.senior@kenzie.com.br",
      "developerInfoDeveloperSince": "2013-01-01T02:00:00.000Z",
      "developerInfoPreferredOS": "MacOS"
    }
    ```

  - **Trying with a non-existent id**:

    ```json
    {
      "message": "Developer not found."
    }
    ```

#

### **PATCH /developers/:id**

- Update name and email informations of a developer

### Examples: 

- **Request**:

  ```json
  {
    "email": "fabio.senior@kenzie.com.br",
    "name": "Fabio Senior"
  }
  ```

  - **Updating a developer successfully**:


    ```json
    {
      "id": 1,
      "email": "fabio.senior@kenzie.com.br",
      "name": "Fabio Senior"
    }
    ```

  - **Trying to update it with an existing email**:

    ```json
    {
      "message": "Email already exists."
    }
    ```

  - **Informing a non-existent id**:

    ```json
    {
      "message": "Developer not found."
    }
    ```

#

### **DELETE /developers/:id**

- Delete a developer by their id;

### Examples

- **Exemplos de retornos**:

  - **Deleting a devleoper by their id**:
  
    | Server response:             |
    | ---------------------------- |
    | Body: no body |
    | Status code: _204 NO CONTENT_ |


#

### **POST /developers/:id/infos**

- Add additional information of a developer using their id;

### Examples 

- **Request**:

  ```json
  {
    "developerSince": "2013-01-01",
    "preferredOS": "MacOS"
  }
  ```

- **Adding new info successfully**:

    ```json
    {
      "id": 1,
      "developerSince": "2013-01-01T02:00:00.000Z",
      "preferredOS": "MacOS",
      "developerId": 1
    }
    ```
#

## **Route - /projects**

## Endpoints

| Method | Endpoint                         | Responsabilities                         |
| ------ | -------------------------------- | ---------------------------------------- |
| POST   | /projects                        | Create a new project                     |
| GET    | /projects/:id                    | Get a project bty its id                 |
| PATCH  | /projects/:id                    | Update a project                         |
| DELETE | /projects/:id                    | Delete a project                         |
| POST   | /projects/:id/technologies       | Associate a technology to a project      |
| DELETE | /projects/:id/technologies/:name | Delete a technology from a project       |

#

### **POST - /projects**

- Create a new project

### Examples 

- **Request**:  

  ```json
  // no endDate
  {
    "name": "Projeto 1",
    "description": "Projeto fullstack",
    "estimatedTime": "2 dias",
    "repository": "url.com.br",
    "startDate": "2023-12-02",
    "developerId": 1
  }

  // with endDate
  {
    "name": "Projeto 2",
    "description": "Projeto backend",
    "estimatedTime": "2 dias",
    "repository": "url.com.br",
    "startDate": "2023-12-10",
    "endDate": "2023-12-23",
    "developerId": 1
  }
  ```

- **Creating a new project successfully**:


    ```json
    // no endDate in the request body
    {
      "id": 1,
      "name": "Projeto 1",
      "description": "Projeto fullstack",
      "estimatedTime": "2 dias",
      "repository": "url.com.br",
      "startDate": "2023-12-02T03:00:00.000Z",
      "endDate": null,
      "developerId": 1
    }

    // with endDate in the request body
    {
      "id": 2,
      "name": "Projeto 2",
      "description": "Projeto backend",
      "estimatedTime": "2 dias",
      "repository": "url.com.br",
      "startDate": "2023-12-10T03:00:00.000Z",
      "endDate": "2023-12-23T03:00:00.000Z",
      "developerId": 1
    }
    ```

#

### **GET - /projects/:id**

- Returns project information by its id;

### Examples 

- **Returning a project successfully**:

    ```json
    [
      {
        "projectId": 1,
        "projectName": "Projeto 1",
        "projectDescription": "Projeto fullstack",
        "projectEstimatedTime": "4 meses",
        "projectRepository": "url.com.br",
        "projectStartDate": "2023-12-02T03:00:00.000Z",
        "projectEndDate": "2023-12-10T03:00:00.000Z",
        "projectDeveloperId": 1,
        "technologyId": 1,
        "technologyName": "JavaScript"
      },
      {
        "projectId": 1,
        "projectName": "Projeto 1",
        "projectDescription": "Projeto fullstack",
        "projectEstimatedTime": "4 meses",
        "projectRepository": "url.com.br",
        "projectStartDate": "2023-12-02T03:00:00.000Z",
        "projectEndDate": "2023-12-10T03:00:00.000Z",
        "projectDeveloperId": 1,
        "technologyId": 9,
        "technologyName": "MongoDB"
      }
    ]
    ```

#

### **PATCH - /projects/:id**

- Update project information by its id

### Examples 

- **Request**:

  ```json
  {
    "name": "Novo nome",
    "description": "Nova descrição",
    "estimatedTime": "1 dia",
    "repository": "novaurl.com.br",
    "startDate": "2023-11-22",
    "developerId": 2
  }
  ```

  - Updating a project successfully:

  ```json
  {
    "id": 1,
    "name": "Novo nome",
    "description": "Nova descrição",
    "estimatedTime": "1 dia",
    "repository": "novaurl.com.br",
    "startDate": "2023-11-22",
    "developerId": 2
  }
  ```

#

### **DELETE - /projects/:id**

- Delete a project by its id.

### Example

- **Deleting a project successfully**:

    | Server response:             |
    | ---------------------------- |
    | Body: bo body |
    | Status code: _204 NO CONTENT_ |


### **POST - /projects/:id/technologies**

- Associates a technology to a project by informing the project id in the url and the name of the technology in the body
- O objeto de retorno deve conter as seguintes chaves:

 ### Examples 
 
- **Request**:


  ```json
  {
    "name": "MongoDB"
  }
  ```

  - **Adding a technology to a project successfully**:

    ```json
    {
      "technologyId": 1,
      "technologyName": "MongoDB",
      "projectId": 1,
      "projectName": "Projeto 1",
      "projectDescription": "Projeto fullstack",
      "projectEstimatedTime": "4 meses",
      "projectRepository": "url.com.br",
      "projectStartDate": "2023-12-02T03:00:00.000Z",
      "projectEndDate": "2023-12-10T03:00:00.000Z"
    }
    ```

#

### **DELETE - /projects/:id/technologies/:name**

- Delete a technology from a project;

- **Deleting it sucessfully**:


    | Server Response:             |
    | ---------------------------- |
    | Body: no body |
    | Status code: _204 NO CONTENT_ |

