import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import router from './routes/index';
import swaggerDocument from './swagger.json';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', router);

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Resource not found',
  });
});
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
export default app;
