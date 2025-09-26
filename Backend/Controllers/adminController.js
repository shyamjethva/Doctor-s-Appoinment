import validator from "validator"
import bcrypt from "bcrypt"
import cloudinary from "../Config/cloudinary.js"
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/AppointmentModel.js"
import UserModel from "../models/UserModel.js"


//Controller to Add Doctor
export const addDoctor = async (req, res) => {

    try {
        const { name, email, password, speciality, degree, experience, about, fees, address, date, slots_booked } = req.body
        const imageFile = req.file
        console.log("REQ BODY:", req.body);
        console.log("REQ FILE:", req.file);


        //checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            console.log("please provide all fileds");
            return res.status(404).json({
                success: false,
                message: "Missing details"
            });
        }

        // validating Email formate
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please Enter Valid email"
            });
        }

        //validating strong password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Please Enter a Strong Password"
            });
        }

        //hasing doctor passsword
        const salt = await bcrypt.genSalt(10)
        const hasedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image"
        })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            password: hasedPassword,
            image: imageUrl,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            date: Date.now(),
            slots_booked
        }
        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save();

        const allDoctors = await doctorModel.find();
        console.log("All Doctors:", allDoctors);

        console.log("Doctor saved successfully in DB:", newDoctor);

        res.status(200).json({
            success: "true",
            message: "Doctor Added Succesfully",
            newDoctor,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error in Add Doctor',
            error
        });

    }
}

//Controller for login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token = jwt.sign(
                { email, password }, // object me send kar raha, but decoding me dikkat hai
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            )

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Token:", decoded);

            return res.status(200).json({
                success: true,
                message: "Login Successfully",
                token
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Invalid Credentials"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in Login",
            error
        });
    }
};


//Controller to get all doctors list from admin panel
export const AllDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({
            success: true,
            message: "Succsessfully get all doctors",
            doctors
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error in get all doctors"
        });
    }
}

//Controller to get all appointments list
export const appointmentAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({})
        res.status(201).json({
            success: true,
            message: "Appointment Admin get successfull",
            appointments
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error"
        });
    }
}

//Controller to Cancel Appointment (Admin)
export const AppointmentCancle = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        console.log("Backend received:", appointmentId); // debug

        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required",
            });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        appointment.cancelled = true;
        await appointment.save();

        res.status(200).json({ success: true, message: "Appointment cancelled successfully" });
    } catch (error) {
        console.error("Cancel Appointment Error:", error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};


//Controller to get dashboard data for admin panel 
export const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        const User = await UserModel.find({})
        const appointments = await appointmentModel.find({})

        const DashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: User.length,
            latestappointment: appointments.reverse().slice(0, 5)
        }

        res.status(201).json({
            success: true,
            message: "Success",
            DashData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error To Get Dashboard Data"
        });
    }
}






export default { addDoctor, loginAdmin, AllDoctors, appointmentAdmin, AppointmentCancle, adminDashboard }