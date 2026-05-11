const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const loggerMiddleware = require('./middleware/logger');
const roomsRouter = require('./routes/rooms');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(loggerMiddleware);

app.use('/api/rooms', roomsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
