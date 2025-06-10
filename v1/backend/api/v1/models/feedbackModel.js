import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;