import "@babel/polyfill"
// const app = require('./app');
// const request = require('supertest');
import app from './app';
import request from 'supertest';

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

describe('server', () => {
  beforeEach(async () => {
    await database.seed.run();
  });

  describe('init', () => {
    it('should return a 200 status', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should return a status code of 200, and all the projects', async () => {
      const expectedProjects = await database('projects').select();

      const response = await request(app).get('/api/v1/projects');
      const projects = response.body;
      
      expect(response.status).toBe(200);
      expect(projects[0].id).toEqual(expectedProjects[0].id);
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should return a status code of 200 and a project with a matching id', async () => {
      const expectedProject = await database('projects').first();
      const { id } = expectedProject;

      const response = await request(app).get(`/api/v1/projects/${id}`);
      const result = response.body[0]

      expect(response.status).toBe(200);
      expect(result.id).toEqual(id);
    })

    it('should return a 404 status code if the project does NOT exist in the DB', async () => {
      const invalidId = -1;

      const response = await request(app).get(`/api/v1/projects/${invalidId}`);
      
      expect(response.status).toBe(404);
      expect(response.body.error).toEqual('Project not found')
    });
  })

  describe('POST ', () => {
    it('should post new project to the db', async () => {
      const newProject = {
        title: 'Unicorn farts',
        palette1_name: 'Colins house',
        palette2_name: 'Nicks house',
        palette3_name: 'Colin and Nicks Crayons'
      }

      const response = await request(app).post('/api/v1/projects').send(newProject);
      
      const projects = await database('projects').where('id', response.body.id);

      const project = projects[0];

      expect(response.status).toBe(201);
      expect(project.title).toEqual('Unicorn farts')
    }) 

    it('should return a 422 status code when the required parameters are incorrect', async () => {
      const badProject = {
        title: 'Normal Colors',
        palette2_name: 'Warm colors',
        palette3_name: 'Cool colors'
      }

      const response = await request(app).post('/api/v1/projects').send(badProject)
      
      expect(response.status).toBe(422);
      expect(response.body.error).toEqual('Expected POST format: { title: <string>, palette1_name: <string>, palette2_name: <string>, palette3_name: <string>}.  You\'re missing the palette1_name property.')
    })
  })

  describe('DELETE', () => {
    it('should delete a palette by its id', async () => {
      const mockPalette = await database('palettes').first();
      const { id } = mockPalette;
      
      const response = await request(app).delete(`/api/v1/palettes/${id}`);
      
      const remainingPalettes = await database('palettes').select();
      
      expect(response.status).toBe(204);
      expect(remainingPalettes.length).toEqual(3)
    });
  })

  describe('GET /api/v1/palettes', () => {
    it('should return a 200 status code and all of the palettes', async () => {
      const expectedPalettes = await database('palettes').select();

      const response = await request(app).get('/api/v1/palettes');
      const palettes = response.body;

      expect(response.status).toBe(200);
      expect(palettes[0].id).toEqual(expectedPalettes[0].id);
    })
  })

  describe('GET /api/v1/palettes/:id', () => {
    it('should return a specific palette by id and a status code of 200', async () => {
      const expectedPalette = await database('palettes').first();
      
      const { id } = expectedPalette;

      const response = await request(app).get(`/api/v1/palettes/${id}`);
      const result = response.body
      console.log(result)
      expect(response.status).toBe(200);
      expect(result.id).toEqual(id);
    });

    it('should return a 404 status code when a palette does not exist', async () => {
      const invalidId = -1;

      const response = await request(app).get(`/api/v1/palettes/${invalidId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toEqual('Palette not found')
    })
  });
})