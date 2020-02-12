# Backend-colors
Backend-colors is a database that stores projects that consist of up to three palettes.  This server works in conjunction with this [frontend-colors](https://github.com/nicknist/frontend-colors) application, if you would like to get, post or delete projects or palettes please follow the instructions in the README for frontend-colors repository.  To see some of the data please see below for the endpoints for backend-colors server.

## Set Up
- Clone down this repository, cd into it, and install the dependencies ``` npm i```.
- In order to run tests, use PostgreSQL to create a database called 'projects' (Commands below):
```
psql
CREATE DATABASE projects;
```
- Once you have made the databse, run the following commands to use the latest migration and seed files
```
knex migrate:latest
knex migrate:latest --env=test
knex seed:run
knex seed:run --env=test
```
- Now it should be all set up! You can now run tests with the ```npm test``` command.

## tech
- express
- knex 
- postgreSQL
- babel
- node.js
- Travis CI

## Endpoints

| Purpose | URL | Verb | Request Body | Sample Success Response |
|----|----|----|----|----|
| Get all projects |`/api/v1/projects`| GET | N/A | All projects on the server: `{projects: [{}, {}, ...]}` 
| Get individual project | `/api/v1/projects/:id` | GET | N/A | A project on the server: `{project: {}}`
| Get all palettes | `/api/v1/palettes` | GET | N/A | All palettes on the server: `{palettes: [{}, {}, {}]}` 
| Get an individual palette | `/api/v1/palettes/:id` | GET | N/A | A palette on the server: `{palette: {}}` 
| Add a new project |`/api/v1/projects`| POST | `{title: <string>, palette1_name: <string>}, palette2_name: <string>}, palette3_name: <string>},` | New project that was added: `{ "id": 145, "title": "Warm Colors", "created_at: "2020-02-10T20:50:15.309Z", "updated_at": "2020-02-10T20:50:15.309Z", "palette1_id": 234, "palette2_id": 235, "palette3_id": 236` 
| Add a new palette | `/api/v1/palettes` | POST | `{ title: <string>, color1: <string>, color2: <string>, color3: <string>, color4: <string>, color5: <string>}` | New palette that was added: `{"id": 220, "title": "Colins Colors", "color1": "#867CBC", "color2": "#E2F7EF", "color3": "#23889A", "color4": "#A6E508", "color5": "#D15120", "created_at": "2020-02-11T12:50:46.043Z", "updated_at": "2020-02-11T12:50:46.043Z"}`
| Delete an existing project |`/api/v1/projects/:id`| DELETE | N/A | For successful deletion: No response body (only 204 status code) 
| Delete an existing palette |`/api/v1/palettes/:id`| DELETE | N/A | For successful deletion: No response body (only 204 status code) | 
| Patch (update) an existing project title | `/api/v1/projects/:id` | PATCH | `{ title: <string> }` | For successful patch: 200 status code, updated project's id: { id: 235 } |
| Patch (update) an existing palette title | `/api/v1/palettes/:id` | PATCH | `{ title: <string> }` | For successful patch: 200 status code, updated palette's id: { id: 235 } | 
