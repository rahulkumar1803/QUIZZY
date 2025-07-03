import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema({
    id: { type: String, require: true },
    mainQuestion: { type: String, require: true },
    choices: { type: [String], require: true },
    correctAnswer: { type: Number, require: true },
    answeredResult: { type: Number, default: -1 },
    statistics: {
        totalAttempts: { type: Number, default: 0 },
        correctAttempts: { type: Number, default: 0 },
        incorrectAttempts: { type: Number, default: 0 },
    },
});

const quizSchema = new mongoose.Schema({
    icon: { type: String, require: true },
    quizTitle: { type: String, require: true },
    quizQuestions: { type: [questionSchema], require: true },
});

const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);

export default Quiz;