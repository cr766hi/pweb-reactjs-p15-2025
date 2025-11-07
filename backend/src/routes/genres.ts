import { Router } from 'express';
import { 
  createGenre, 
  getAllGenres, 
  getGenreById, 
  updateGenre, 
  deleteGenre 
} from '../controllers/genreController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Semua endpoint butuh authentication
router.post('/', authenticate, createGenre);
router.get('/', getAllGenres); // Bisa diakses tanpa auth sesuai API docs
router.get('/:id', getGenreById);
router.patch('/:id', authenticate, updateGenre);
router.delete('/:id', authenticate, deleteGenre);

export default router;