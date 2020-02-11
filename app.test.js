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

  describe('POST /api/v1/projects', () => {
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

  describe('POST /api/v1/palettes', () => {
    it('should be able to POST a palette', async () => {
      const newPalette = {
        title: 'Colors',
        color1: '#867CBC',
        color2: '#E2F7EF',
        color3: '#23889A',
        color4: '#A6E508',
        color5: '#D15120'
      }

      const response = await request(app).post('/api/v1/palettes').send(newPalette);

      const palettes = await database('palettes').where('id', response.body.id)
      const palette = palettes[0];
      
      expect(response.status).toBe(201);
      expect(palette.title).toEqual('Colors')
    });

    it('should return a 422 status code when the required parameters are incorrect', async () => {
      const badPalette = {
        title: 'Colors',
        color1: '#867CBC',
        color2: '#E2F7EF',
        color4: '#A6E508',
        color5: '#D15120'
      }

      const response = await request(app).post('/api/v1/palettes').send(badPalette)

      expect(response.status).toBe(422);
      expect(response.body.error).toEqual('Expected POST format: { title: <string>, color1: <string>, color2: <string>, color3: <string>, color4: <string>, color5: <string>}.  You\'re missing the color3 property.')
    })
  })

  describe('DELETE /api/v1/projects/:id', () => {
    it('should delete a project by its id', async () => {
      const mockProject = await database('projects').first();
      const { id } = mockProject;
      
      const response = await request(app).delete(`/api/v1/projects/${id}`);
      
      const remainingProjects = await database('projects').select();

      expect(response.status).toBe(204);
      expect(remainingProjects.length).toEqual(0);
    })
  })

  describe('DELETE /api/v1/palettes/:id', () => {
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

  describe('PATCH /api/v1/projects/:id', () => {
    it('should change the name of project and return a status code of 200', async () => {
      let expectedProject = await database('projects').first();
      const { id } = expectedProject;
      expect(expectedProject.title).toEqual('Hot pants');
      const newTitle = { title: '80\'s Neon' };
      const response = await request(app).patch(`/api/v1/projects/${id}`).send(newTitle)
      expectedProject = await database('projects').first();

      expect(response.status).toBe(200);
      expect(expectedProject.title).toEqual('80\'s Neon');
    })
  });

  it('should return a 404 if a project ID does not exist', async () => {
    const invalidId = -2;

    const response = await request(app).get(`/api/v1/projects/${invalidId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toEqual('Project not found')
  })
})