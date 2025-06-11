import Feedback from "../models/feedbackModel.js";

export const submitFeedback = async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;
    if (!rating || !message) {
      return res
      .status(400)
      .json({ 
        success: false,
        message: "Rating and message are required" 
      });
    }
    const feedback = new Feedback({
      name: name || "Anonymous",
      email: email || "No email provided",
      rating,
      message,
    });
    
    console.log(`Received feedback: ${feedback}`);

    await feedback.save();
    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json({
        success: true,
        data: feedbacks,
        });
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
