import express from 'express'
import { addDoctor, loginAdmin, AllDoctors, appointmentAdmin, AppointmentCancle, adminDashboard } from '../Controllers/adminController.js'
import upload from '../middleware/multer.js'
import authAdmin from '../middleware/AuthAdmin.js'
import { changeAvailablity } from '../Controllers/doctorController.js'


const adminRouter = express.Router()

// adminRouter.js
adminRouter.post("/add-doctors", upload.single("image"), authAdmin, addDoctor)

//login routes
adminRouter.post('/login', loginAdmin)

//get all doctors routes
adminRouter.post('/all-Doctors', authAdmin, AllDoctors)

//change Availablity routes 
adminRouter.post('/change-availability', authAdmin, changeAvailablity)

//admin appointments
adminRouter.get('/appointments', authAdmin, appointmentAdmin)

//cancle appointment
adminRouter.post('/cancel-appointment', authAdmin, AppointmentCancle)

//get dashboard data
adminRouter.get('/dashboard', authAdmin, adminDashboard)





export default adminRouter