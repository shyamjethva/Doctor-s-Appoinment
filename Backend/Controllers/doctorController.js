import doctorModel from '../models/doctorModel.js';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import appointmentModel from '../models/AppointmentModel.js';

// change doctor availablity
export const changeAvailablity = async (req, res) => {
    const { doctorId } = req.body;

    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    res.status(200).json({
        success: true,
        message: "Availability changed successfully",
        doctor
    });
};

//Doctor List
export const DoctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        return res.status(201).json({
            success: true,
            message: "Doctors",
            doctors
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error doctor List",
            error
        });

    }
}

//api for doctor login
export const DoctorLogin = async (req, res) => {
    try {

        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Invalid credential"
            });
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            // const token = JWT.sign({ id: doctor._id }, process.env.JWT_SECRET)
            const token = JWT.sign(
                { id: doctor._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" } // token 7 din valid rahega
            );

            res.status(201).json({
                success: true,
                message: "Login Successfull",
                token,

            });
        }
        else {
            res.status(404).json({
                success: false,
                message: "Invalid Credential",
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in doctor login",
            error
        });
    }
}

//api to get doctor appointment for doctor panel
export const appointmentDoctor = async (req, res) => {
    try {
        const docId = req.docId; // authDoctor middleware se
        console.log("Doctor ID from middleware:", docId);

        if (!docId) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID missing"
            });
        }

        // Agar docId string hai, ObjectId me convert kar
        const appointments = await appointmentModel.find({ docId: docId.toString() });
        console.log("Appointments fetched from DB:", appointments);

        res.status(200).json({
            success: true,
            message: "Appointments fetched",
            appointments
        });
        console.log("appointments", appointments);
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Error in doctor Appointment",
            error
        });
    }
}

//API to mark appointment completed for doctor panel 
export const appointmentComplete = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const docId = req.docId;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
            return res.json({
                success: true,
                message: "Appointment Completed"
            });
        } else {
            return res.json({
                success: false,
                message: "Not authorized for this appointment"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error in Appointment to complete",
            error
        });
    }
};


// API to mark appointment Cancel
export const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const docId = req.docId;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
            return res.json({
                success: true,
                message: "Appointment Cancelled"
            });
        } else {
            return res.json({
                success: false,
                message: "Not authorized for this appointment"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error in Appointment to Cancel",
            error
        });
    }
};


//API to Dashboard data for the doctor panel
export const DoctorDashboard = async (req, res) => {
    try {
        const docId = req.docId;
        const appointments = await appointmentModel.find({ docId })
        let earning = 0
        appointments.forEach((item) => {
            if (item.isCompleted || item.payment) {
                earning += item.amount;
            }
        });

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earning,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointment: appointments.reverse().slice(0, 5)
        }

        res.status(201).json({
            success: true,
            message: " successfully Doctor Dashboard",
            dashData
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error in DOctor Dashboard",
            error
        });
    }
}


//API for Doctor Profile
export const DoctorProfile = async (req, res) => {
    try {
        const docId = req.docId;
        const profileData = await doctorModel.findById(docId).select('-password')

        res.status(201).json({
            success: true,
            message: "successfully get Doctor Profile",
            profileData
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error in DOctor Profile",
            error
        });
    }
}

//API for Update doctor profiel data for doctor panel
export const updateDoctor = async (req, res) => {

    try {
        const { docId, fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.status(201).json({
            success: true,
            message: "Doctor Profile Updated"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error in DOctor Update",
            error
        });
    }
}


export default {
    changeAvailablity,
    DoctorList,
    DoctorLogin,
    appointmentDoctor,
    appointmentComplete,
    appointmentCancel,
    DoctorDashboard,
    DoctorProfile,
    updateDoctor
} 