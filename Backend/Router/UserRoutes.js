import express from 'express'
import { getUser, loginUser, registerUser, UpdateUser, AppointmentBook, isAppointment, PaymentRazorpay, verifyRazorpay, CancleAppointment, } from '../Controllers/UserController.js'
import authUser from '../middleware/authUser.js'
import upload from '../middleware/multer.js'

const UserRouter = express.Router()

//register API
UserRouter.post('/register', registerUser)

//Login API
UserRouter.post('/login', loginUser)

//get user API
UserRouter.get('/getUser', authUser, getUser) //get-profile


//Update User 
UserRouter.post('/UpdateUser', authUser, upload.single('image'), UpdateUser) //update-profile

// appointment booking 
UserRouter.post('/appointmentBook', authUser, AppointmentBook)

//user Appointments 
UserRouter.get('/UserAppointment', authUser, isAppointment)

//cancle Appointments
UserRouter.post("/CancelAppointment", authUser, CancleAppointment);

//payment razorpay
UserRouter.post('/payment', authUser, PaymentRazorpay)

//verify razorpay
UserRouter.post('/verifyrazorpay', authUser, verifyRazorpay)



export default UserRouter