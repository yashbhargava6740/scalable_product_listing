import express from 'express';

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
    app.get('/', (req: express.Request, res: express.Response) => {
        res.send('Server is running');
    });
    app.use('/admin', adminRoutes);
    app.use('/user', userRoutes);
    app.use('/auth', authRoutes);
}
