import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { getProducts, getProduct } from '../controllers/userControllers';
const router = express.Router();
router.route('/getProducts').get(protect, getProducts);
router.route('/getProduct/:pid').get(protect, getProduct);
// router.route('/getProducts').get(protect, )
module.exports = router;