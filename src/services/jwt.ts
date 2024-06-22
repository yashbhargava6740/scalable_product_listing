import { UserOrAdmin } from '../types';
import JWT from 'jsonwebtoken';
import { JWTUser } from "../interfaces";
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "1234";
class JWTService { 
    public static generateWebToken(user: UserOrAdmin, role: string) {
        const payload : JWTUser = {
            id: user?.id,
            email: user?.email,
            role
        }
        const token = JWT.sign(payload, JWT_SECRET, {expiresIn: '5h'});
        return token;
    }

    public static decodeToken(token: string) {
        return JWT.verify(token,JWT_SECRET) as JWTUser;
    }
}
export default JWTService;