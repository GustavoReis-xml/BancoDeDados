const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// String de conexão - aponte para seu banco "rede_games"
const uri = "mongodb://localhost:27017/rede_games"; 
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Conectado ao MongoDB!");

    const database = client.db("rede_games");
    const produtosCollection = database.collection("produtos");

    // Rota solicitada pela atividade 
    app.get('/produtos', async (req, res) => {
      try {
        const produtos = await produtosCollection.find({})
          .project({ // Seleciona apenas nome e preço
            _id: 0, // 0 para excluir o campo _id
            nome: 1,  // 1 para incluir o campo nome
            preco: 1  // 1 para incluir o campo preco
          })
          .limit(5) // Limita aos 5 primeiros resultados
          .toArray();
        
        res.json(produtos);
      } catch (err) {
        res.status(500).send("Erro ao buscar produtos");
      }
    });

    app.listen(port, () => {
      console.log(`API rodando em http://localhost:${port}`);
    });

  } catch (err) {
    console.error("Não foi possível conectar ao MongoDB", err);
  }
}

run();