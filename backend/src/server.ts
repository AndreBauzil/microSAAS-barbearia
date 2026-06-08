import express from 'express';
import cors from 'cors';
import { routes } from './routes'; 

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || '*'
  }));
app.use(express.json());
app.use(routes); 

const PORT = 3333;
if (process.env.NODE_ENV !== 'production') {
    const PORT = 3333;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor local rodando na porta ${PORT}`);
    });
  }

export default app;