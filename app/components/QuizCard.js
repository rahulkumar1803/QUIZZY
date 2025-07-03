'use client';
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import { faCode, faEllipsis, faPlay } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link';
import useGlobalContextProvider from '../ContextApi';
import convertToFaIcons from '../convertToFaIcons';

function successRate(singleQuiz) {
    let correctQuestions = 0;
    let totalAttemptes = 0;
    let successRate = 0;

    singleQuiz.quizQuestions.forEach((question) => {
        if (question.statistics) {
            totalAttemptes += question.statistics.totalAttempts || 0;
            correctQuestions += question.statistics.correctAttempts || 0;
        }
    });

    if (totalAttemptes === 0) return 0;

    successRate = Math.ceil((correctQuestions / totalAttemptes) * 100);
    return successRate;
}


function QuizCard({ singleQuiz }) {
    const { quizToStartObject, dropDownToggleObject , threeDotsPositionsObject , selectedQuizObject } = useGlobalContextProvider();
    const { setDropDownToggle } = dropDownToggleObject;

    const { setSelectQuizToStart } = quizToStartObject;
    const {setThreeDotsPositions } = threeDotsPositionsObject;
    const { selectedQuiz , setSelectedQuiz } = selectedQuizObject;

    const { quizTitle, quizQuestions, icon } = singleQuiz;
    const totalQuestions = quizQuestions.length;
    const globalSuccessRate = successRate(singleQuiz);

    function openDropDownMenu(event) {
        const xPos = event.clientX;
        const yPos = event.clientY;

        setThreeDotsPositions({x: xPos , y: yPos});
        if (event) {
            console.log(event);
            event.stopPropagation();
        }

        setDropDownToggle(true);
        setSelectedQuiz(singleQuiz);
    }

    console.log(selectedQuiz);

    return (
        <div className='rounded-[10px] flex flex-col gap-2 border border-gray-300 bg-white p-4'>
            {/* {image container} */}
            <div className='relative bg-green-700 w-full h-32 flex justify-center items-center rounded-md'>
                {/* more options icon */}
                <div className='absolute cursor-pointer top-3 right-3'>
                    <FontAwesomeIcon
                        className='text-white'
                        height={13}
                        width={13}
                        icon={faEllipsis}
                        onClick={openDropDownMenu}
                    />
                </div>
                {/* Quiz Icon */}
                <FontAwesomeIcon
                    className='text-white'
                    width={120}
                    height={120}
                    icon={convertToFaIcons(icon)}
                />
            </div>
            {/* Title Area */}
            <h3 className="font-bold">{quizTitle}</h3>
            {/* Questions */}
            <p className='text-sm font-light'> {totalQuestions} Question(s)</p>
            {/* FooterArea */}
            <div className="flex gap-3">
                {/* Success Rate Area */}
                <div className="flex gap-1 items-center">
                    <Image src="/target-777.png" width={20} height={20} alt='' />
                    <span className='text-[12px]'>Success rate : {globalSuccessRate}%</span>
                </div>
                <div
                    onClick={() => {
                        setSelectQuizToStart(singleQuiz);
                    }}
                    className="rounded-full w-7 h-7 bg-green-700 flex items-center justify-center cursor-pointer">
                    <Link href="/quiz-start">
                        <FontAwesomeIcon
                            className='text-white'
                            width={15}
                            height={15}
                            icon={faPlay}
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default QuizCard
