import { Router } from 'express';
import { 
  createTransaction, 
  getAllTransactions, 
  getTransactionById, 
  getTransactionStatistics 
} from '../controllers/transactionController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createTransaction);
router.get('/', authenticate, getAllTransactions);
router.get('/statistics', authenticate, getTransactionStatistics);
router.get('/:id', authenticate, getTransactionById);

export default router;