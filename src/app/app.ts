import express from 'express';
import cors from 'cors';
import hpp from 'hpp';

import { indexRouter } from '../routes/index.route';
import { mainErrorHandler, notFoundHandler } from '../middlewares/error.middleware';
import { ARENA_CONFIG } from '../config/arena.config';

const app = express();

/* Middleware stack */
app.use(cors());
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', ARENA_CONFIG);

/* Initialize Routing */
app.use(indexRouter);

/* Error Handling */
app.use('*', notFoundHandler);
app.use(mainErrorHandler);

export default app;
