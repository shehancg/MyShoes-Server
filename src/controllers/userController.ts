import { Request, Response } from 'express';
import { userModel } from '../models/userModel';
import bcrypt from 'bcryptjs';
import { generateToken } from '../configs/security';

export class UserController {
    async register(req: Request, res: Response) {
        try {
            const existingEmail = await userModel.findOne({ email: req.body.email });

            if (existingEmail) {
                return res.status(409).json({ message: 'Email already in use' });
            }

            const hashedPassword = bcrypt.hashSync(req.body.password, 11);

            const newUser = new userModel({
                name: req.body.name,
                email: req.body.email,
                passwordHash: hashedPassword,
                phoneNo: req.body.phoneNo,
                location: req.body.location,
                isAdmin: req.body.isAdmin,
            });

            const savedUser = await newUser.save();

            if (!savedUser) {
                return res.status(400).send('The user cannot be created!');
            }

            res.send(savedUser);
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async login(req: Request, res: Response) {
        try {
            const user = await userModel.findOne({ email: req.body.email });

            if (!user) {
                return res.status(400).send('Incorrect Email');
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
                res.status(400).send('Incorrect Password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const user = await userModel.findById(req.params.id).select('-passwordHash');

            if (!user) {
                return res.status(404).json({ message: 'The user with the given ID does not exist' });
            }

            res.status(200).send(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const allUsers = await userModel.find().select('-passwordHash');

            res.send(allUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async getUserCount(req: Request, res: Response) {
        try {
            const userCount = await userModel.count();

            res.send({
                userCount: userCount,
            });
        } catch (error) {
            console.error('Error fetching user count:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}
