import { Request, Response } from 'express';
import { usersModel } from '../models/usersModel';
import bcrypt from 'bcryptjs';
import { generateToken } from '../configs/security';
import {HTTP_BAD_REQUEST, HTTP_CONFLICT, HTTP_NOT_FOUND, INTERNAL_SERVER_ERROR} from "../configs/httpStatus";
import {ItemModel} from "../models/itemsModel";

export class UserController {
    async register(req: Request, res: Response) {
        try {
            const existingEmail = await usersModel.findOne({ email: req.body.email });

            if (existingEmail) {
                return res.status(HTTP_CONFLICT).json({ message: 'Email already in use' });
            }

            const hashedPassword = bcrypt.hashSync(req.body.password, 11);

            const newUser = new usersModel({
                name: req.body.name,
                email: req.body.email,
                passwordHash: hashedPassword,
                phoneNo: req.body.phoneNo,
                location: req.body.location,
                isAdmin: req.body.isAdmin,
            });

            const savedUser = await newUser.save();

            if (!savedUser) {
                return res.status(HTTP_BAD_REQUEST).send('The user cannot be created!');
            }

            res.send(savedUser);
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }

    async login(req: Request, res: Response) {
        try {
            const user = await usersModel.findOne({ email: req.body.email });

            if (!user) {
                return res.status(HTTP_BAD_REQUEST).send('Incorrect Email');
            }

            if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
                const token = generateToken({ user: user.email, userRole: user.isAdmin });
                res.status(200).cookie('accessToken', token, {
                    httpOnly: true,
                    sameSite: 'none',
                    path: '/api',
                }).json({
                    message: {
                        token: token,
                        user: user,
                    },
                });
            } else {
                res.status(HTTP_BAD_REQUEST).send('Incorrect Password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const user = await usersModel.findById(req.params.id).select('-passwordHash');

            if (!user) {
                return res.status(HTTP_NOT_FOUND).json({ message: 'The user with the given ID does not exist' });
            }

            res.status(200).send(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const allUsers = await usersModel.find().select('-passwordHash');

            res.send(allUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }

    async getUserCount(req: Request, res: Response) {
        try {
            const userCount = await usersModel.count();

            res.send({
                userCount: userCount,
            });
        } catch (error) {
            console.error('Error fetching user count:', error);
            res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const deleteUser = await usersModel.findByIdAndRemove(req.params.id);

            if (deleteUser) {
                res.status(200).json({ success: true, message: 'User deleted' });
            } else {
                res.status(HTTP_NOT_FOUND).json({ success: false, message: 'User not found' });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const updateData = req.body; // Update data received from the client

            // Find the user by ID and update the fields
            const updatedUser = await usersModel.findByIdAndUpdate(userId, updateData, { new: true });

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}
