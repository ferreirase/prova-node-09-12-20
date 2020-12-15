import 'reflect-metadata';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors'; // pacote para tratamento de erros assíncronos
import routes from './routes/index';
import './database';
import AppError from './errors/AppError';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const app = express();

app.use([cors(), express.json(), routes]);

// fazendo tratativa de erros de todas as rotas com um middleware
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  // se for um erro conhecido na minha aplicação
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: err.statusCode, message: err.message });
  }

  // se for um erro desconhecido, retorno uma mensagem genérica
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(process.env.PORT, () =>
  console.log(`server started on port ${process.env.PORT}`),
);
