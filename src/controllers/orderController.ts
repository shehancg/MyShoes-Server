import { Request, Response } from 'express';
import { OrderModel } from '../models/ordersModel';
import { OrderStatus } from '../configs/orderStatus';
import { v4 as uuidv4 } from 'uuid';

export class OrderController {
    async getAllOrders(req: Request, res: Response) {
        try {
            const allOrders = await OrderModel.find();
            res.send(allOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async createOrder(req: Request, res: Response) {
        try {
            const requestOrder = req.body;

            if (!requestOrder.items || requestOrder.items.length === 0) {
                return res.status(400).send('Cart Is Empty!');
            }

            await OrderModel.deleteOne({
                user: req.body.user,
                status: OrderStatus.NEW,
            });

            const newOrder = new OrderModel({ ...requestOrder, user: req.body.user });
            await newOrder.save();
            res.send(newOrder);
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async getNewOrderForCurrentUser(req: Request, res: Response) {
        try {
            const order = await OrderModel.findOne({ user: req.body.user, status: OrderStatus.NEW });

            if (order) {
                res.send(order);
            } else {
                res.status(404).send('No new order found for current user.');
            }
        } catch (error) {
            console.error('Error fetching new order for current user:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async payForOrder(req: Request, res: Response) {
        try {
            const { paymentId } = req.body;
            const order = await OrderModel.findById(req.params.id);

            if (!order) {
                return res.status(404).send('Order Not Found!');
            }

            order.paymentId = paymentId;
            order.status = OrderStatus.PAID;
            await order.save();

            res.send(order._id);
        } catch (error) {
            console.error('Error paying for order:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async trackOrderById(req: Request, res: Response) {
        try {
            const order = await OrderModel.findById(req.params.id);

            if (order) {
                res.send(order);
            } else {
                res.status(404).send('Order not found.');
            }
        } catch (error) {
            console.error('Error tracking order:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async payForOrderNew(req: Request, res: Response) {
        try {
            const paymentId = uuidv4(); // Generate a unique payment ID
            const orderId = req.params.id;

            const order = await OrderModel.findById(orderId);

            if (!order) {
                return res.status(404).send('Order Not Found!');
            }

            order.paymentId = paymentId;
            order.status = OrderStatus.PAID;
            await order.save();

            res.send({ orderId, paymentId }); // Sending the generated paymentId in the response
        } catch (error) {
            console.error('Error paying for order:', error);
            res.status(500).send('Internal Server Error');
        }
    }

}
