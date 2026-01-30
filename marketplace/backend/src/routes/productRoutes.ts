import express from 'express';
import { createProduct, getProducts , updateProduct,deleteProduct, isOwnerOrAdmin} from '../controllers/productController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, createProduct);
router.route('/:id')
  .put(protect, isOwnerOrAdmin, updateProduct)   
  .delete(protect, isOwnerOrAdmin, deleteProduct); 

export default router;