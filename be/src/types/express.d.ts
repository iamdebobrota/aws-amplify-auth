import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any; // Define the user property, adjust type as needed
        }
    }
}
