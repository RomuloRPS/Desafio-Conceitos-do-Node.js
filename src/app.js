const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { url, title, techs } = request.body;
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id == id);
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  
  if(repository) {
    repository.url = url;
    repository.title = title;
    repository.techs = techs;
  } else {
    return response.status(400).json({error: 'repository not found'});
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repository = repositories.findIndex(repository => repository.id == id);
  
  if (repository < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }

  repositories.splice(repository, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }

  repositories[repositoryIndex].likes++;

  return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
