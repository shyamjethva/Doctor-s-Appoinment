import express from 'express'
import { appointmentCancel, appointmentComplete, appointmentDoctor, DoctorDashboard, DoctorList, DoctorLogin, DoctorProfile, updateDoctor } from '../Controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';

const DoctorRouter = express.Router()

//get doctor list
DoctorRouter.get('/list', DoctorList)

//Doctor Login
DoctorRouter.post('/doclogin', DoctorLogin)

//appointments for doctor 
DoctorRouter.get('/appointments', authDoctor, appointmentDoctor)

//appointment to complete
DoctorRouter.post('/completeAppointment', authDoctor, appointmentComplete)

//appointment to cancel
DoctorRouter.post('/cancelAppointment', authDoctor, appointmentCancel)

//Doctor Dashboard
DoctorRouter.get('/doctor-dashboard', authDoctor, DoctorDashboard)

//Doctor Profile
DoctorRouter.get('/doctor-profile', authDoctor, DoctorProfile)

//doctor profile upadte 
DoctorRouter.post('/update-profile', authDoctor, updateDoctor)



export default DoctorRouter





