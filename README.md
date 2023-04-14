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

    ```json

    ```

#

### **POST /developers/:id/infos**

- Add additional information of a developer using their id;

### Examples 

- **Exemplos de retornos**:
  | Dados de entrada: |
  | ----------------- |
  | Body: Formato Json |

  ```json
  {
    "developerSince": "2013-01-01",
    "preferredOS": "MacOS"
  }
  ```

  - Criando uma informação adicional com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _201 CREATED_ |

    ```json
    {
      "id": 1,
      "developerSince": "2013-01-01T02:00:00.000Z",
      "preferredOS": "MacOS",
      "developerId": 1
    }
    ```

  - Tentando cadastrar informação à um developer que já possui:

    | Resposta do servidor:       |
    | --------------------------- |
    | Body: Formato Json          |
    | Status code: _409 CONFLICT_ |

    ```json
    {
      "message": "Developer infos already exists."
    }
    ```

  - Tentando cadastrar informação com um preferedOS inválido:
    | Dados de entrada: |
    | ----------------- |
    | Body: Formato Json |

    ```json
    {
      "developerSince": "10/02/2018",
      "preferedOS": "Other OS"
    }
    ```

    | Resposta do servidor:          |
    | ------------------------------ |
    | Body: Formato Json             |
    | Status code: _400 BAD REQUEST_ |

    ```json
    {
      "message": "Invalid OS option.",
      "options": ["Windows", "Linux", "MacOS"]
    }
    ```

  - Tentando cadastrar informação com um developer id inválido:

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Developer not found."
    }
    ```

#

## **Rota - /projects**

## Endpoints

| Método | Endpoint                         | Responsabilidade                         |
| ------ | -------------------------------- | ---------------------------------------- |
| POST   | /projects                        | Cadastrar um novo projeto                |
| GET    | /projects/:id                    | Listar um projeto pelo id                |
| PATCH  | /projects/:id                    | Atualizar um projeto                     |
| DELETE | /projects/:id                    | Excluir um projeto                       |
| POST   | /projects/:id/technologies       | Cadastrar uma tecnologia para um projeto |
| DELETE | /projects/:id/technologies/:name | Deletar uma tecnologia de um projeto     |

## Regras da aplicação

### **POST - /projects**

- Deve ser possível cadastrar um novo projeto enviando os seguintes dados:
  - **name**: tipo **_string_**
  - **description**: tipo **_string_**
  - **estimatedTime**: tipo **_string_**
  - **repository**: tipo **_string_**
  - **startDate**: tipo **_Date_**, formato americano YYYY-MM-DD.
  - **endDate**: tipo **_Date_**, formato americano YYYY-MM-DD.
  - **developerId**: tipo **_number_**
- No body de retorno, caso o _endDate_ não seja enviado na criação, deve ser retornado um _null_;
- **Sucesso**:
  - Body esperado: objeto contendo todos o dados do projeto criado;
  - Status esperado: _201 CREATED_
- **Falha**:
  - Caso: developerId não pertence à um developer cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
- **Exemplos**:
  | Dados de entrada: |
  | ----------------- |
  | Body: Formato Json |

  ```json
  // sem endDate
  {
    "name": "Projeto 1",
    "description": "Projeto fullstack",
    "estimatedTime": "2 dias",
    "repository": "url.com.br",
    "startDate": "2023-12-02",
    "developerId": 1
  }

  // com endDate
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

  - Criando um projeto com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _201 CREATED_ |

    ```json
    // sem endDate no body de envio
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

    // com endDate no body de envio
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

  - Tentando criar com um developerId inválido:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Developer not found."
    }
    ```

#

### **GET - /projects/:id**

- Deve ser possível retornar os dados de um _project_ a partir do _id_ desse projeto;
- O retorno deve ser um array de objetos e cada objeto deve retornar os dados da tabela **_technologies_projects_**
- Cada objeto deve conter as seguintes chaves:

  - **projectId**
  - **projectName**
  - **projectDescription**
  - **projectEstimatedTime**
  - **projectRepository**
  - **projectStartDate**
  - **projectEndDate**
  - **projectDeveloperId**
  - **technologyId** (esse dado pode ser nulo)
  - **technologyName** (esse dado pode ser nulo)

- **Sucesso**:
  - Body esperado: array de objetos contendo todos os dados relacionados ao projeto e suas tecnologias;
  - Status esperado: _200 OK_
- **Falha**:
  - Caso: project id não pertence a um project cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
- **Exemplos**:

  - Criando um projeto com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _201 CREATED_ |

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

  - Tentando listar com um project id inválido:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Project not found."
    }
    ```

#

### **PATCH - /projects/:id**

- Deverá ser possível atualizar todos os dados de um projeto com exceção do _id_;
- Todos os dados permitidos para atualização devem ser opicionais no envio;
- **Sucesso**:
  - Body esperado: objeto contendo todos os dados do projeto que foi atualizado;
  - Status esperado: _200 OK_
- **Falha**:
  - Caso: project id informado na url não pertence à um projeto cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
  - Caso: developerId informado no body não pertence à um developer cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
- **Exemplos**:
  | Dados de entrada: |
  | ----------------- |
  | Body: Formato Json |

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

  - Atualizando um projeto com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _200 OK_ |

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

  - Tentando atualizar com um project id inválido:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Project not found."
    }
    ```

  - Tentando atualizar com um developerId inválido:
    | Dados de entrada: |
    | ----------------- |
    | Body: Formato Json |

    ```json
    {
      "developerId": 9999
    }
    ```

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Developer not found."
    }
    ```

#

### **DELETE - /projects/:id**

- Deve ser possível deletar um projeto especificando seu id;

- **Sucesso**:
  - Body esperado: nenhum. Não deve retornar nenhum body;
  - Status esperado: _204 NO CONTENT_
- **Falha**:

  - Caso: id informado não pertence à nenhum project cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.

- **Exemplos de retornos**:

  - Deletando um developer com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: nenhum body |
    | Status code: _204 NO CONTENT_ |

    ```json

    ```

  - Tentando deletar com um id inexistente:

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Project not found."
    }
    ```

#

### **POST - /projects/:id/technologies**

- Deve ser possível adicionar uma tecnologia existente na tabela _technologies_ a um projeto, informando o _id_ do projeto através da _url_ e o _name_ da tecnologia através do body;
- O objeto de retorno deve conter as seguintes chaves:

  - **technologyId**
  - **technologyName**
  - **projectId**
  - **projectName**
  - **projectDescription**
  - **projectEstimatedTime**
  - **projectRepository**
  - **projectStartDate**
  - **projectEndDate**

- **Sucesso**:
  - Body esperado: objeto contendo os dados de retorno esperados;
  - Status esperado: _201 CREATED_
- **Falha**:

  - Caso: project id informado não pertence à nenhum project cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
  - Caso: technology name não é um nome válido com base nos dados existentes na tabela _technologies_
    - Body esperado: um objeto contendo duas chaves:
      - **_message_**: contendo uma mensagem adequada
      - **_option_**: sendo um array contendo todas as tecnologias válidas;
    - Status esperado: _400 BAD REQUEST_.
  - Caso: technology name informado já existe no projeto informado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _409 CONFLICT_.

- **Exemplos de retornos**:
  | Dados de entrada: |
  | ----------------- |
  | Body: Formato Json |

  ```json
  {
    "name": "MongoDB"
  }
  ```

  - Adicionando uma nova tecnologia com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: nenhum body |
    | Status code: _201 CREATED_ |

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

  - Tentando vincular uma tecnologia, enviando um project id inexistente:

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Project not found."
    }
    ```

  - Tentando vincular uma tecnologia, enviando um technology name inexistente na tabela de tecnologias:

    | Resposta do servidor:          |
    | ------------------------------ |
    | Body: Formato Json             |
    | Status code: _404 BAD REQUEST_ |

    ```json
    {
      "message": "Technology not supported.",
      "options": [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB"
      ]
    }
    ```

  - Tentando vincular uma tecnologia já existente no projeto:

    | Resposta do servidor:       |
    | --------------------------- |
    | Body: Formato Json          |
    | Status code: _409 CONFLICT_ |

    ```json
    {
      "message": "This technology is already associated with the project"
    }
    ```

#

### **DELETE - /projects/:id/technologies/:name**

- Deve ser possível _**desvincular**_ uma _tecnologia_ atrelada a um _projeto_ enviando o _id_ do projeto e _nome_ da tecnologia através da _url_;

- **ATENÇÃO**: a tecnologia não deve ser excluída da tabela _technologies_, mas sim apenas ser _desvinculada_ de um projeto. Para isso deve ser alterada a tabela _projects_technologies_;
- **Sucesso**:
  - Body esperado: nenhum. Não deve retornar nenhum body;
  - Status esperado: _204 NO CONTENT_
- **Falha**:

  - Caso: project id informado não pertence à nenhum project cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
  - Caso: technology name informado é válido porém não pertence à nenhum project cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _400 BAD REQUEST_.
  - Caso: technology name não é um nome válido com base nos dados existentes na tabela _technologies_
    - Body esperado: um objeto contendo duas chaves:
      - **_message_**: contendo uma mensagem adequada
      - **_option_**: sendo um array contendo todas as tecnologias válidas;
    - Status esperado: _400 BAD REQUEST_.

- **Exemplos de retornos**:

  - Desvinculando uma tecnologia com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: nenhum body |
    | Status code: _204 NO CONTENT_ |

    ```json

    ```

  - Tentando desvincular uma tecnologia, enviando um project id inexistente:

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Project not found."
    }
    ```

  - Tentando desvincular uma tecnologia, enviando um technology name não vinculado ao projeto:

    | Resposta do servidor:          |
    | ------------------------------ |
    | Body: Formato Json             |
    | Status code: _400 BAD REQUEST_ |

    ```json
    {
      "message": "Technology not related to the project."
    }
    ```

  - Tentando desvincular uma tecnologia, enviando um technology name inexistente na tabela de tecnologias:

    | Resposta do servidor:          |
    | ------------------------------ |
    | Body: Formato Json             |
    | Status code: _400 BAD REQUEST_ |

    ```json
    {
      "message": "Technology not supported.",
      "options": [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB"
      ]
    }
    ```
