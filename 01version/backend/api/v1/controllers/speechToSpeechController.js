export const getSpeechToSpeech = (req, res) => {
    res.json({
        message: "This is the Speech to Speech API endpoint. Please use POST method with audio data.",
        status: "success",
    });
}



export default {
    getSpeechToSpeech,
}