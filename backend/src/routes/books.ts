import { Router } from 'express';
import { 
  createBook, 
  getAllBooks, 
  getBookById, 
  getBooksByGenre, 
  updateBook, 
  deleteBook 
} from '../controllers/bookController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Semua endpoint butuh auth kecuali GET
router.post('/', authenticate, createBook);
router.get('/', authenticate, getAllBooks);
router.get('/genre/:id', authenticate, getBooksByGenre);
router.get('/:id', authenticate, getBookById);
router.patch('/:id', authenticate, updateBook);
router.delete('/:id', authenticate, deleteBook);

export default router;