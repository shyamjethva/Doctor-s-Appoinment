import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDb from './Config/mongoDb.js';
import './Config/cloudinary.js';
import adminRouter from './Router/adminRoute.js';
import Doctorrouter from './Router/doctorroutes.js';
import UserRouter from './Router/UserRoutes.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 4000;

connectDb();

// middleware
app.use(express.json());
app.use(cors());

app.use('/api/admin', adminRouter);
app.use('/api/doctor', Doctorrouter);
app.use('/api/user', UserRouter)

app.get('/', (req, res) => {
    res.send("API working properly");
});

app.listen(port, () => console.log("server started...", port));
