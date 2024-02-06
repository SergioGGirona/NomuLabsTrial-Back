import cors from 'cors';
import createDebug from 'debug';
import express from 'express';
import morgan from 'morgan';

const debug = createDebug('NomuLabs: App');

export const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

debug('Started');
