import validator from 'validator'
import bcrypt from 'bcrypt'
import UserModel from '../models/UserModel.js'
import JWT from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import appointmentModel from '../models/AppointmentModel.js'
import DoctorModel from '../models/doctorModel.js'
import razorpay from 'razorpay'

//Controller to register USer
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(404).json({
                success: false,
                message: "Missing Details",
            });
        }

        //validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Enter a Valid Email"
            });
        }
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        //Validating strong password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Passwrod contains at least 8 character"
            });
        }

        //hashing User password
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,

            password: hashedpassword
        }

        const newUSer = new UserModel(userData)
        const user = await newUSer.save()

        const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET)
        console.log("token", token);

        return res.status(201).json({
            success: true,
            message: "User Registerd",
            token
        });


    } catch (error) {
        console.log("Register Error", error);
        res.status(500).json({
            success: false,
            message: "User can't Register",
            error
        })
    }
}


//Controller for User login 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password is provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please register first.",
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate JWT token
        const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "500d",
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                name: user.name,
                email: user.email,
                id: user._id
            }
        });

    } catch (error) {
        console.log("Login Error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed",
            error
        });
    }
};

//Controller for get User profile data
export const getUser = async (req, res) => {
    try {
        const userId = req.userId; // ✅ use this, not req.user.id
        console.log("Get User ID:", userId);

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};



//Controller to Update the user profile
export const UpdateUser = async (req, res) => {
    console.log("req.body", req.body);
    try {


        const userId = req.userId; // ✅ middleware se aayega
        console.log("Updating user with ID:", userId);

        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        console.log("Body:", req.body);
        console.log("File:", req.file);

        if (!name || !phone || !dob || !gender) {
            return res.status(400).json({
                success: false,
                message: "Missing data"
            });
        }

        // Update basic info
        await UserModel.findByIdAndUpdate(
            userId,
            {
                name,
                phone,
                dob,
                gender,
                address: JSON.parse(address)
            }
        );

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image"
            });
            const imageUrl = imageUpload.secure_url;

            await UserModel.findByIdAndUpdate(userId, { image: imageUrl });
        }

        res.status(200).json({
            success: true,
            message: "Profile Updated"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in API",
            error: error.message
        });
    }
};


//Controller to book appointment
export const AppointmentBook = async (req, res) => {
    try {
        const userId = req.userId;
        const { docId, slotDate, slotTime } = req.body;

        if (!docId || !slotDate || !slotTime) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }
        const parsedDate = new Date(slotDate);

        let formattedSlotDate;
        if (slotDate.includes("/")) {
            const [day, month, year] = slotDate.split("/");
            formattedSlotDate = `${day}/${month}/${year.length === 2 ? "20" + year : year}`;
        } else {
            const d = parsedDate.getDate().toString().padStart(2, "0");
            const m = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
            const y = parsedDate.getFullYear();
            formattedSlotDate = `${d}/${m}/${y}`;
        }

        const doctorData = await DoctorModel.findById(docId).select('-password');
        if (!doctorData) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        if (!doctorData.available) {
            return res.status(400).json({ success: false, message: "Doctor not available" });
        }

        let slots_booked = doctorData.slots_booked;

        // Slot availability check
        if (slots_booked[formattedSlotDate]) {
            if (slots_booked[formattedSlotDate].includes(slotTime)) {
                return res.status(400).json({
                    success: false,
                    message: "Slot Not Available"
                });
            } else {
                slots_booked[formattedSlotDate].push(slotTime);
            }
        } else {
            slots_booked[formattedSlotDate] = [slotTime];
        }

        const userData = await UserModel.findById(userId).select("-password");

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        delete doctorData.slots_booked;

        // Appointment create
        const appointmentData = {
            userId,
            docId,
            userData,
            doctorData,
            amount: doctorData.fees,
            slotDate: formattedSlotDate,
            slotTime,
            date: Date.now(),
            cancelled: false,
            payment: false,
            isCompleted: false
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // Update booked slots
        await DoctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            appointment: newAppointment
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in Appointment API"
        });
    }
}


//Controller to get user Appointments
export const isAppointment = async (req, res) => {
    try {
        const userId = req.userId
        const appointments = await appointmentModel.find({ userId })

        res.status(201).json({
            success: true,
            appointments
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error In User Appointment"
        });
    }
}

//Controller for cancle Appointment 
export const CancleAppointment = async (req, res) => {

    try {
        const { userId } = req.userId;
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required",
            });
        }

        // find Appointment
        const appointment = await appointmentModel.findOne({
            _id: appointmentId,
            user: userId,
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        if (appointment.cancelled) {
            return res.status(400).json({
                success: false,
                message: "Appointment already cancelled",
            });
        }

        // Cancel appointment
        appointment.cancelled = true;
        appointment.status = "Cancelled";
        await appointment.save();

        const doctor = await DoctorModel.findById(appointment.doctor);
        if (doctor && doctor.slots_booked[appointment.slotDate]) {
            doctor.slots_booked[appointment.slotDate] =
                doctor.slots_booked[appointment.slotDate].filter(
                    (time) => time !== appointment.slotTime
                );
            await doctor.save();
        }

        res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully",
            appointment,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in Cancle Appointment",
            error
        })
    }
}



// reazorpay key and id
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY
})


console.log("Razorpay Keys:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay secret Keys:", process.env.RAZORPAY_SECRET_KEY);


//Controller for Payment of Appoinment
export const PaymentRazorpay = async (req, res) => {

    try {
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        console.log("appointment data", appointmentData);

        if (!appointmentData || appointmentData.cancelled) {
            return res.status(400).json({
                success: false,
                message: "Appointment Cacelled or not found"
            });
        }

        //creating options for razor payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId
        }

        //creation of an folder
        const order = await razorpayInstance.orders.create(options)

        res.json({
            success: true,
            message: "Order Successfull",
            order
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in Payment",
            error
        })
    }

}

//Controller to verify payment of razorpay
export const verifyRazorpay = async (req, res) => {
    try {

        const { razorpay_order_id } = req.body
        const orderinfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderinfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderinfo.receipt, { payment: true })
            res.status(201).json({
                success: true,
                message: "Payment Successful"
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: "Payment Failed"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in verify payment"
        })
    }
}



export default {
    registerUser,
    loginUser,
    UpdateUser,
    AppointmentBook,
    isAppointment,
    CancleAppointment,
    PaymentRazorpay,
    verifyRazorpay
}