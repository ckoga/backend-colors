const express = require('express');
const app = express()
const cors = require('cors');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.json())
app.use(cors());
app.locals.title = 'colin-and-nick-make-colors'

app.get('/', (request, response) => {
  response.status(200).json();
})

app.get('/api/v1/projects', async (request, response) => {
  try {
    const projects = await database('projects').select();
    response.status(200).json(projects);
  } catch (error) {
    response.status(500).json({ error })
  }
});

app.get('/api/v1/projects/:id', async (request, response) => {
  const { id } = request.params

  try {
    const project = await database('projects').where('id', id)

    if (project.length) {
      response.status(200).json(project)
    } else {
      response.status(404).json({ error: 'Project not found' })
    }
  } catch (error) {
    response.status(500).json({ error })
  }
});

app.post('/api/v1/palettes', async (request, response) => {
  const palette = request.body;

  for (let requiredParameter of ['title', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if (!palette[requiredParameter]) {
      return response.status(422).send({
        error: `Expected POST format: { title: <string>, color1: <string>, color2: <string>, color3: <string>, color4: <string>, color5: <string>}.  You\'re missing the ${requiredParameter} property.`
      })
    }
  }

  try {
    let newPalette = await database('palettes').insert(palette, '*');
    
    response.status(201).json(newPalette[0])
  } catch (error) {
    response.status(500).json({ error })
  }
})

app.post('/api/v1/projects', async (request, response) => {
  const project = request.body;
  
  for (let requiredParameter of ['title', 'palette1_name', 'palette2_name', 'palette3_name']) {
    if (!project[requiredParameter]) {
      return response.status(422).send({
        error: `Expected POST format: { title: <string>, palette1_name: <string>, palette2_name: <string>, palette3_name: <string>}.  You're missing the ${requiredParameter} property.`
      })
    }
  }

  let palette1_id = await database('palettes').where({ title: project.palette1_name }).select('id');
  let palette2_id = await database('palettes').where({ title: project.palette2_name }).select('id');
  let palette3_id = await database('palettes').where({ title: project.palette3_name }).select('id');

  const newProject = {
    title: project.title,
    palette1_id: palette1_id[0].id,
    palette2_id: palette2_id[0].id,
    palette3_id: palette3_id[0].id
  }

  try {
    const project = await database('projects').insert(newProject, '*');
    response.status(201).json(project[0])
  } catch (error) {
    response.status(500).json({ error })
  }
})

app.delete('/api/v1/projects/:id', async (request, response) => {
  try {
    await database('projects').where({ id: request.params.id }).del();
    response.status(204).json();
  } catch (error) {
    response.status(500).json({ error });
  }
})

app.delete('/api/v1/palettes/:id', async (request, response) => {
  try {
    await database('palettes').where({ id: request.params.id }).del()
    response.status(204).json()
  } catch (error) {
    response.status(500).json({ error })
  }
})

app.get('/api/v1/palettes', async (request, response) => {
  try {
    const palettes = await database('palettes').select();
    response.status(200).json(palettes);
  } catch (error) {
    response.status(500).json({ error })
  }
})

app.get('/api/v1/palettes/:id', async (request, response) => {
  const { id } = request.params

  try {
    const palette = await database('palettes').where('id', id)
    if (palette.length) {
      response.status(200).json(palette[0])
    } else {
      response.status(404).json({ error: 'Palette not found' })
    }
  } catch (error) {
    response.status(500).json({ error })
  }
})

app.patch('/api/v1/projects/:id', async (request, response) => {
  const newTitle = request.body;
  const { id } = request.params;
  const targetProject = await database('projects').where('id', id)
  if(!targetProject.length) {
    response.status(404).json({ error: 'Project not found' })
  }
  
  try {
    const updatedProject = await database('projects').where({ id: id }).update(newTitle, 'id');
    response.status(200).json(updatedProject)
  } catch (error) {
    response.status(500).json({ error })
  }
});

app.patch('/api/v1/palettes/:id', async (request, response) => {
  const newTitle = request.body;
  const { id } = request.params;

  try {
    console.log(newTitle)
    const updatedPalette = await database('palettes').where({ id: id }).update(newTitle, 'id');
    !updatedPalette ? response.sendStatus(404) : response.status(200).json(updatedPalette)
  } catch (error) {
    response.status(500).json({ error })
  }
})
module.exports = app;
