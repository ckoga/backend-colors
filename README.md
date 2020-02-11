# colin-and-nick-make-colors

## tech
- express
- knex 
- postgreSQL
- babel
- node.js

## Endpoints

| Purpose | URL | Verb | Request Body | Sample Success Response |
|----|----|----|----|----|
| Get all publishers |`/api/v1/publishers`| GET | N/A | All orders on the server: `{publishers: [{}, {}, ...]}` |
| Add new publisher |`/api/v1/publisher`| POST | `{publisher: <String>, location: <String>}` | New publisher that was added: `{ "publisher_id": 145, "publisher": { "publisher": "Refactor Text", "location": "Somewhere" }}` |
| Delete existing publisher |`/api/v1/publisher/:id`| DELETE | N/A | For successful deletion: No response body (only 204 status code) |
