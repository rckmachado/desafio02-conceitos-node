const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4"); //Criando isUuid para teste da ID do repositório.

const app = express();

//Função que valida o ID do repositório, se encontrar erro retorna um JSON com status 400.
function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
      return response.status(400).json({ error: 'Invalid project ID.' });
  }

  return next(); //Se o ID for validado, continua o código.
}

app.use('/repositories/:id', validateRepositoryId); //Chamada da função de validação.

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => { //Retorna a lista de repositórios.
  return response.json(repositories);
});

app.post("/repositories", (request, response) => { //Cria o repositório.
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository); //Insere os dados no repositório.

  return response.json(repository); 
});

app.put("/repositories/:id", (request, response) => { //Altera o respositório de acordo com a ID.
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const likes = repositories[repositoryIndex].likes
  
  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => { //Deleta o respositório de acordo com o ID.
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send(); //Retorno HTTP de Sucesso!

});

app.post("/repositories/:id/like", (request, response) => { //Adiciona likes.
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

 repositories[repositoryIndex].likes += 1; //Acrescenta em +1.

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
