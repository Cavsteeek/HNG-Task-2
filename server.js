// server.js
import express from 'express';
import cors from 'cors';
import router from './routes.js';
import 'dotenv/config';


const app = express();
app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => res.send("API working"));
app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
