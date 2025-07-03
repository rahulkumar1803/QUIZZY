'use client';
import React, { useState, useEffect, useRef } from 'react';
import useGlobalContextProvider from '@/app/ContextApi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

function QuizStartQuestions({ onUpdateTime }) {
    const time = 15;
    const { quizToStartObject, allQuizzes, setAllQuizzes } = useGlobalContextProvider();
    const { selectQuizToStart } = quizToStartObject;

    const { quizQuestions } = selectQuizToStart || {};
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [indexOfQuizSelected, setIndexOfQuizSelected] = useState(null);
    const [isQuizEnded, setIsQuizEnded] = useState(false);
    const [score, setScore] = useState(0);

    const [timer, setTimer] = useState(time);
    const intervalRef = useRef(null);
    const router = useRouter();

    function ensureStatistics(question) {
        if (!question.statistics) {
            question.statistics = {
                totalAttempts: 0,
                correctAttempts: 0,
                incorrectAttempts: 0,
            };
        }
    }

    function startTimer() {
        clearInterval(intervalRef.current);
        setTimer(time);
        intervalRef.current = setInterval(() => {
            setTimer((currentTime) => {
                if (currentTime === 0) {
                    clearInterval(intervalRef.current);
                    return 0;
                }
                return currentTime - 1;
            });
        }, 1000);
    }

    async function saveDataIntoDB() {
        try {
            const id = selectQuizToStart._id;
            // Get the _id of the quiz
            if (id) { // Check if id is not undefined
                const res = await fetch(
                    `api/quizzes?id=${id}`, // Include the id as a query parameter
                    {
                        method: 'PUT',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            updateQuizQuestions: allQuizzes[indexOfQuizSelected].quizQuestions,
                        }),
                    },
                );
                console.log(allQuizzes[indexOfQuizSelected].quizQuestions);
                // You might want to handle the response here as well
            } else {
                console.error("Quiz ID is undefined. Cannot save data.");
                // Handle the case where the ID is undefined, maybe show an error to the user.
            }
            console.log(allQuizzes[indexOfQuizSelected].quizQuestions);
            if (!res.ok) {
                toast.error('Something went wrong while saving...');
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const quizIndexFound = allQuizzes.findIndex(
            (quiz) => quiz._id === selectQuizToStart?._id
        );
        setIndexOfQuizSelected(quizIndexFound);
    }, []);

    useEffect(() => {
        startTimer();
        return () => clearInterval(intervalRef.current);
    }, [currentQuestionIndex]);

    useEffect(() => {
        onUpdateTime(timer);
    }, [timer]);

    useEffect(() => {
        if (timer === 0 && !isQuizEnded && indexOfQuizSelected !== null) {
            const allCopy = [...allQuizzes];
            const question = allCopy?.[indexOfQuizSelected]?.quizQuestions?.[currentQuestionIndex];

            if (!question) return;

            ensureStatistics(question);
            question.statistics.totalAttempts += 1;
            question.statistics.incorrectAttempts += 1;

            setAllQuizzes(allCopy);

            if (currentQuestionIndex !== quizQuestions.length - 1) {
                setTimeout(() => {
                    setCurrentQuestionIndex((current) => current + 1);
                }, 1000);
            } else {
                setIsQuizEnded(true);
            }
        }
    }, [timer]);

    useEffect(() => {
        if (isQuizEnded) {
            quizQuestions.forEach((q) => (q.answeredResult = -1));
            console.log('Quiz has ended...');
            saveDataIntoDB();
        }
    }, [isQuizEnded]);

    function selectChoiceFunction(choiceIndexClicked) {
        setSelectedChoice(choiceIndexClicked);

        const allCopy = [...allQuizzes];
        const question = allCopy?.[indexOfQuizSelected]?.quizQuestions?.[currentQuestionIndex];
        if (question) question.answeredResult = choiceIndexClicked;

        setAllQuizzes(allCopy);
    }

    function moveToTheNextQuestion() {
        const allCopy = [...allQuizzes];
        const question = allCopy?.[indexOfQuizSelected]?.quizQuestions?.[currentQuestionIndex];
        if (!question) return;

        ensureStatistics(question);

        if (question.answeredResult === -1 || question.answeredResult === undefined) {
            toast.error('Please select an answer');
            return;
        }

        question.statistics.totalAttempts += 1;

        if (question.answeredResult !== question.correctAnswer) {
            question.statistics.incorrectAttempts += 1;
            toast.error('Incorrect Answer!');
            if (currentQuestionIndex !== quizQuestions.length - 1) {
                setTimeout(() => {
                    setCurrentQuestionIndex((current) => current + 1);
                    setSelectedChoice(null);
                }, 1200);
            } else {
                setTimer(0);
                clearInterval(intervalRef.current);
                setIsQuizEnded(true);
            }

            setAllQuizzes(allCopy);
            return;
        }

        question.statistics.correctAttempts += 1;
        setScore((prev) => prev + 1);
        toast.success('Awesome!');

        if (
            currentQuestionIndex === quizQuestions.length - 1 &&
            question.answeredResult === question.correctAnswer
        ) {
            setTimer(0);
            clearInterval(intervalRef.current);
            setIsQuizEnded(true);
            setAllQuizzes(allCopy);
            return;
        }

        setTimeout(() => {
            setCurrentQuestionIndex((current) => current + 1);
            setSelectedChoice(null);
        }, 2000);

        setAllQuizzes(allCopy);
    }

    if (!selectQuizToStart || !quizQuestions) return null;

    return (
        <div className="poppins rounded-sm m-9 w-9/12">
            <Toaster
                toastOptions={{
                    className: '',
                    duration: 1500,
                    style: {
                        padding: '12px',
                    },
                }}
            />
            <div className="flex justify-center items-center gap-2">
                <div className="bg-green-700 flex justify-center items-center rounded-md w-11 h11 text-white p-3">
                    {currentQuestionIndex + 1}
                </div>
                <p>{quizQuestions[currentQuestionIndex].mainQuestion}</p>
            </div>

            <div className="mt-7 flex flex-col gap-2">
                {quizQuestions[currentQuestionIndex].choices.map((choice, indexChoice) => (
                    <div
                        key={indexChoice}
                        onClick={() => selectChoiceFunction(indexChoice)}
                        className={`p-3 ml-11 w-10/12 border border-green-700 rounded-md
                            hover:bg-green-700 hover:text-white transition-all select-none ${selectedChoice === indexChoice
                                ? 'bg-green-700 text-white'
                                : 'bg-white'
                            }`}
                    >
                        {choice}
                    </div>
                ))}
            </div>

            <div className="flex justify-end mt-7">
                <button
                    onClick={moveToTheNextQuestion}
                    disabled={isQuizEnded}
                    className={`p-2 px-5 text-[15px] text-white rounded-md bg-green-700 mr-[70px] cursor-pointer
                        ${isQuizEnded ? 'opacity-60' : 'opacity-100'}`}
                >
                    Submit
                </button>
            </div>

            <div className="flex items-center justify-center">
                {isQuizEnded && (
                    <ScoreComponent
                        quizStartParentProps={{
                            setIsQuizEnded,
                            setIndexOfQuizSelected,
                            setCurrentQuestionIndex,
                            setSelectedChoice,
                            score,
                            setScore,
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default QuizStartQuestions;

// === ScoreComponent below remains the same ===
function ScoreComponent({ quizStartParentProps }) {
    const { quizToStartObject, allQuizzes } = useGlobalContextProvider();
    const { selectQuizToStart } = quizToStartObject;
    const numberOfQuestions = selectQuizToStart.quizQuestions.length;
    const router = useRouter();

    const {
        setIsQuizEnded,
        setIndexOfQuizSelected,
        setCurrentQuestionIndex,
        setSelectedChoice,
        setScore,
        score,
    } = quizStartParentProps;

    function emojiIconScore() {
        const emojiFaces = ['confused-emoji.png', 'happy-emoji.png', 'very-happy-emoji.png'];
        const result = (score / numberOfQuestions) * 100;

        if (result < 25) return emojiFaces[0];
        if (result === 50) return emojiFaces[1];
        return emojiFaces[2];
    }

    function tryAgainFunction() {
        setIsQuizEnded(false);
        const quizzesArray = Array.isArray(allQuizzes) ? allQuizzes : Object.values(allQuizzes);
        const newQuizIndex = quizzesArray.findIndex((quiz) => quiz._id === selectQuizToStart._id);
        setIndexOfQuizSelected(newQuizIndex);
        setCurrentQuestionIndex(0);
        setSelectedChoice(null);
        setScore(0);
    }

    return (
        <div className="flex items-center justify-center rounded-md top-40 border border-gray-200 absolute w-[40%] p-5 bg-white">
            <div className="flex gap-4 items-center justify-center flex-col">
                <Image src={`/${emojiIconScore()}`} alt="emoji" width={100} height={100} />
                <div className="flex gap-1 flex-col">
                    <span className="font-bold text-2xl">Your Score</span>
                    <div className="text-[22px] text-center">
                        {score}/{numberOfQuestions}
                    </div>
                </div>

                <button
                    onClick={tryAgainFunction}
                    className="p-2 bg-green-700 rounded-md text-white px-6"
                >
                    Try Again
                </button>

                <div className="w-full flex gap-2 flex-col mt-3">
                    <div className="flex gap-1 items-center justify-center">
                        <Image src="/correct-answer.png" alt="correct" width={20} height={20} />
                        <span className="text-[14px]">Correct Answers: {score}</span>
                    </div>
                    <div className="flex gap-1 items-center justify-center">
                        <Image src="/incorrect-answer.png" alt="incorrect" width={20} height={20} />
                        <span className="text-[14px]">
                            Incorrect Answers: {numberOfQuestions - score}
                        </span>
                    </div>
                </div>

                <span
                    onClick={() => router.push('/')}
                    className="text-green-700 select-none cursor-pointer text-sm mt-8"
                >
                    Select Another Quiz
                </span>
            </div>
        </div>
    );
}
