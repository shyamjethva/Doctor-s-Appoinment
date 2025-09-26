import mongoose from "mongoose";

const appointmentScheme = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    docId: {
        type: String,
        require: true
    },
    slotDate: {
        type: String,
        require: true
    },
    slotTime: {
        type: String,
        require: true
    },
    userData: {
        type: Object,
        require: true
    },
    doctorData: {
        type: Object,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    date: {
        type: Number,
        require: true
    },
    cancelled: {
        type: Boolean,
        default: false
    },
    payment: {
        type: Boolean,
        require: false
    },
    isCompleted: {
        type: Boolean,
        require: false
    }
})

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentScheme);

export default appointmentModel