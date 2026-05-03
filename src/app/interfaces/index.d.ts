import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface User extends JwtPayload {
            _id: string;
            email: string;
            role: string;
            name: string;
        }
        
        interface Request {
            user?: User;
        }
    }
}