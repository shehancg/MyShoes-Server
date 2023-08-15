import { Request, Response } from 'express';
import { ItemModel } from '../models/itemsModel';
import {HTTP_BAD_REQUEST, HTTP_NOT_FOUND, INTERNAL_SERVER_ERROR} from "../configs/httpStatus";

export class ItemController {
    async getAllItems(req: Request, res: Response) {
        try {
            const allItems = await ItemModel.find();
            res.send(allItems);
        } catch (error) {
            console.error('Error fetching items:', error);
            res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }

    async getItemById(req: Request, res: Response) {
        try {
            const item = await ItemModel.findById(req.params.id);

            if (!item) {
                return res.status(HTTP_NOT_FOUND).json({ message: 'The item with the given ID does not exist' });
            }

            res.send(item);
        } catch (error) {
            console.error('Error fetching item:', error);
            res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }

    async addItem(req: Request, res: Response) {
        try {
            const file = req.file;

            if (!file) {
                return res.status(HTTP_BAD_REQUEST).json({ success: false, message: 'No image file was provided' });
            }

            const fileName = file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/assets/uploads/`;

            let newItem = new ItemModel({
                name: req.body.name,
                description: req.body.description,
                image: `${basePath}${fileName}`,
                price: req.body.price,
                countInStock: req.body.countInStock,
            });

            newItem = await newItem.save();

            if (!newItem) {
                return res.status(INTERNAL_SERVER_ERROR).send('The product cannot be created');
            }

            res.send(newItem);
        } catch (error) {
            console.error('Error adding item:', error);
            res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }

    async deleteItem(req: Request, res: Response) {
        try {
            const deletedItem = await ItemModel.findByIdAndRemove(req.params.id);

            if (deletedItem) {
                res.status(200).json({ success: true, message: 'Item deleted' });
            } else {
                res.status(HTTP_NOT_FOUND).json({ success: false, message: 'Item not found' });
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }

    async getItemCount(req: Request, res: Response) {
        try {
            const itemCount = await ItemModel.count();

            res.send({
                itemCount: itemCount,
            });
        } catch (error) {
            console.error('Error fetching item count:', error);
            res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }

    async updateItem(req: Request, res: Response) {
        try {
            const itemId = req.params.id;
            const updateData = req.body; // Assuming the request body contains the fields to update

            const updatedItem = await ItemModel.findByIdAndUpdate(itemId, updateData, { new: true });

            if (!updatedItem) {
                return res.status(HTTP_NOT_FOUND).json({ success: false, message: 'Item not found' });
            }

            res.send(updatedItem);
        } catch (error) {
            console.error('Error updating item:', error);
            res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }
}
