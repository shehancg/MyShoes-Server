import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Set a secret key for signing and verifying JWTs
const secretKey: Secret = process.env.SECRET_KEY || 'defaultsecret';

// Authenticate a user and return a JWT
function generateToken(payload: object): string {
    try {
        // Create a JWT containing the user's id and other claims
        return jwt.sign(payload, secretKey);
    } catch (error) {
        const typedError = error as Error;
        throw new Error(typedError.message);
    }
}

// Verify a JWT and return the decoded payload
function verify(req: any, res: any, next: any) {
    try {
        // const token = req.cookies.accessToken
        const authorization = req.headers.authorization as string;
        const token = authorization.split(' ')[1];

        // Verify the JWT and return the decoded payload
        req.user = jwt.verify(token, secretKey);
        next();
    } catch (error) {
        const typedError = error as Error;
        // If the JWT is invalid, return an error
        res.status(401);
        res.statusMessage = 'Invalid token';
        res.json({
            message: typedError.message,
        });
        res.end();
    }
}

export {
    generateToken,
    verify,
};
