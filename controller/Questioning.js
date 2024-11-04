const Question = require("../model/Questioning");

// Add Question 
const addQuestion = async (req, res) => {
    const { questionText, options } = req.body;
    // Validation
    if (!questionText || !options || options.length !== 4) {
        return res.status(400).json({ message: "Please provide a valid question and exactly 4 options" });
    }

    try {
        // Create the question
        const newQuestion = new Question({
            questionText,
            options
        });

        // Save the question to the database
        await newQuestion.save();
        res.status(201).json({ message: 'Question added successfully', question: newQuestion });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Get Latest Question 
const getQuestion = async (req, res) => {
    try {
        const questions = await Question.find().sort({ _id: -1 }).limit(10);

        res.status(200).json(questions)
    }
    catch (err) {
        console.log(err)
    }
}
// Function to filter questions created today
const getTodaysQuestions = async (req,res) => {
    console.log("getting todays questions")
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0); // Set time to the beginning of the day in UTC
    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999); // Set time to the end of the day in UTC

    try {
        const todaysQuestions = await Question.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        res.status(200).json(todaysQuestions)
    } catch (error) {
        console.error("Error fetching today's questions:", error);
    }
};



module.exports = { 
    addQuestion,
    getQuestion,
    getTodaysQuestions
 };