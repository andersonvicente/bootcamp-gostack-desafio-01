const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let countRequests = 0;

server.use('/', (req, res, next) => {
  next();
  countRequests++;
  console.log(countRequests);
});

function checkProjectExists(req, res, next) {
  const project = projects.find(el => el.id === req.params.id);
  if (!project) {
    return res.status(400).json('Project not found');
  }

  req.project = project;

  return next();
};

//POST /projects
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

//GET /projects
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//PUT /projects/:id
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id }  = req.params;
  const { title } = req.body;

  req.project.title = title;

  return res.json(projects);
});

//DELETE /projects/:id
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id }  = req.params;

  projects.forEach((element, index) => {
    if(element.id === id) {
      projects.splice(index, 1);
    }
  });

  return res.send();
});

//POST /projects/:id/tasks
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  req.project.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);