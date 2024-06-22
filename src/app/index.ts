import { protect } from '../middlewares/authMiddleware';
import express from 'express';
import cookieParser from 'cookie-parser';
const adminRoutes =  require('../routes/adminRoutes');
const userRoutes = require('../routes/userRoutes');
const authRoutes = require('../routes/authRoutes');
const app = express();

require("dotenv").config();
const PORT = process.env.PORT;
export async function init() {
    app.listen(PORT, async() => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use('/admin', adminRoutes);
    app.use('/user', userRoutes);
    app.use('/auth', authRoutes);
    app.get('/testRoute', protect);
    app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Server is running');
    });
}
