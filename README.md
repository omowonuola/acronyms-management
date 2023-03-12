MESSAGING ACRONYMS APP


API

- REST API With Nestjs
- Swagger documentation, nextjs logger, ...
- Folder Structure, Code Samples

## 1. Getting started

### 1.1 Requirements

Before starting, make sure you have these components on your local machine:

- An up-to-date release of [NodeJS](https://nodejs.org/) and YARN
- A SQL database with TYPEORM npm install --save typeorm mysql2 (https://docs.nestjs.com/recipes/sql-typeorm#sql-typeorm)

### 1.2 Project configuration

Start by cloning this project on your local machine.

``` sh
git clone https://github.com/omowonuola/acronyms-management.git
NOTE: The Main branch is the update branch for the codebase
```
RUN WITH DOCKER

The project is dockerized, you can run it through the docker-compose file has the necessary environment variables
```sh
# Launch the development server with docker

cd server(To run the server application)
docker-compose up
```
RUN WITH SERVER

The next step will be to install all the dependencies of the project.

```sh
yarn add for the server folder
```

For a standard development configuration, you can leave the default values for PORT, which has the default value of 8081.

### 1.3 Launch and discover with YARN

You are now ready to launch the NestJS application using the command below.

```sh
# Launch the development server with npm command
yarn run start:dev
```
### 1.4 Swagger Documentation

```sh
You can now head to `http://localhost:8081/api#/Acronyms` and see the API Swagger docs. 
The example Acronym API that gets all acronyms in the database with pagination and limit is located at the `http://localhost:8081/api#/acronym/AcronymController_getAllAcronyms` endpoint in the swagger documentation.

The Api System Design can be viewed here Link `https://excalidraw.com/#json=l9hmIFCTi_Auqlsw9iG4s,ikI16LfXYB-so5wMvKJXWQ`
```

## 2. Project structure

This template was made with a well-defined directory structure.

```sh
src/
├── acronmys
│   ├── acronyms.controller.ts # The acronyms controller file contains the api calls for loading the acronym json data into the database  get all acronyms in the database, create new acronyms, delete acronyms and update acronym definition.
│   ├── acronyms.entity.ts/  # The entity file contains the data model structure and type, it references to the mysql database
│   ├── acronyms.module.ts
│   ├── acronyms.repository.ts # The repository file references the database by running queries directly to the database
│   ├── acronyms.service.ts # The service file has the create and get api which references the repository file
│   ├── acronyms.service.spec.ts # The service.spec file has the test file for the service functions
├── dto
│   ├── create-acronyms.dto.ts # The file contains the DTO for creating new acronyms process
|   ├── update-acronyms.dto.ts # The file contains the DTO for the database update process
├── auth
│   ├── auth.controller.ts # The file for the websocket implementation
|   ├── auth.entity.ts # The entity file contains the data model, structure and type for the authentication process, it references to the mysql database
|   ├── auth.module.ts
|   ├── auth.repository.ts # The repository file for the authentication references the database by running queries directly to the database
|   ├── auth.service.ts # The service file has the user signup and signin function which references the repository file
|   ├── jwt-passport.ts
|   ├── jwt-payload.ts
├──acronym.json # The acronyms data converted to JSON format and uploaded in bulk to the database using the load data api 
├──docker-compose.yaml # The docker directory that house the services and the docker environmental variables.
├──dockerfile # The dockerfile that has the ports and the command to run the application.
└── main.ts
```

## 3. Default NPM commands

The YARN commands below are already included with this template and can be used to quickly run, build and test the project.

```sh
# Start the application using npm NodeJS in development
yarn run start:dev (use this to start the application locally)

# Run the project' unit tests
yarn run test:watch(use this to start the unit testing locally)
```

## 4. Docker Command

The docker commands below are already included with this template and can be used to quickly run, build and test the project.

```sh
# Start the application using npm NodeJS in development
docker-compose up

The docker configuration is in the docker-compose.yaml file
```


## 5. Project goals

The goal of this project is to build a acronym management process which includes creating new acronyms, updating the existing acronyms, deleting the acronyms in the database using NestJS.

