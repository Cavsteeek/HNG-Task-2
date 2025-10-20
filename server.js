// server.js
import express from 'express';
import cors from 'cors';
import router from './routes.js';
import 'dotenv/config';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(cors({ credentials: true }));

app.get('/', (req, res) => res.send("API working"));
app.use('/', router);

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

