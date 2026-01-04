import Router from './http/Router.js';
import MovieHandler from './http/handlers/MovieHandler.js';





export const router = new Router();

router.get('/api/movies', { handler: new MovieHandler(), method: 'index' });
router.get('api//movies/{movieId}', { handler: new MovieHandler(), method: 'show' });
router.post('/api/movies', { handler: new MovieHandler(), method: 'store' });
router.put('/api/movies/{movieId}', { handler: new MovieHandler(), method: 'update' });
router.delete('/api/movies/{movieId}', { handler: new MovieHandler(), method: 'delete' })



