import express from 'express';
import logger from 'morgan';
import router from './routes/index';

const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
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
