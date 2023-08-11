import express from 'express';
import { OrderController } from '../controllers/orderController';
import asyncHandler from 'express-async-handler';

const router = express.Router();
const orderController = new OrderController();

router.get('/', orderController.getAllOrders);
router.post('/create', orderController.createOrder);
router.get('/newOrderForCurrentUser', asyncHandler(orderController.getNewOrderForCurrentUser));
/*router.post('/pay', orderController.payForOrder);*/
router.post('/pay/:id', orderController.payForOrder);
router.post('/payNew/:id', orderController.payForOrderNew);
router.get('/track/:id', asyncHandler(orderController.trackOrderById));

export default router;
