'use client';

import React, {
  useState,
  useEffect,
  useRef,
  createRef,
  forwardRef,
  useLayoutEffect,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import toast , {Toaster} from 'react-hot-toast';
import Choices from './Choices';

function QuizBuildQuestions({ focusProp , quizQuestions , setQuizQuestions }) {
  const prefixes = ['A', 'B' , 'C' , 'D'];
  const { focus, setFocusFirst } = focusProp;
  const endOfListRef = useRef(null);
  const textAreaRefs = useRef(quizQuestions.map(() => createRef()));

  console.log(quizQuestions);

  function addNewQuestion() {
    setFocusFirst(false);
    const lastIndexQuizQuestions = quizQuestions.length - 1;
    if (
      quizQuestions[lastIndexQuizQuestions].mainQuestion.trim(' ').length === 0
    ) {
      toast.error(`The question ${lastIndexQuizQuestions + 1} is still Empty`);
      textAreaRefs.current[lastIndexQuizQuestions].current.focus();
      return;
    }

    for(const choice of quizQuestions[lastIndexQuizQuestions].choices){
      const singleChoice = choice.substring(2);
      if(singleChoice.trim(' ').length === 0){
        return toast.error(
          'please ensure that all previous choices are filled out!'
        );
      }
    }

    if(quizQuestions[lastIndexQuizQuestions].correctAnswer.length === 0){
      return toast.error(`Please ensure to fill out the correct answer!`);
    }

    const newQuestion = {
      id: uuidv4(),
      mainQuestion: '',
      choices: prefixes.slice(0,2).map((prefix) => prefix + '. '),
      correctAnswer: '',
    };
    setQuizQuestions([...quizQuestions, newQuestion]);
    textAreaRefs.current = [...textAreaRefs.current, createRef()];
  }

  function deleteQuestion(singleQuestion) {
    const quizQuestionsCopy = [...quizQuestions];
    const filterQuestionToDelete = quizQuestionsCopy.filter(
      (question) => singleQuestion.id !== question.id,
    );
    const updatedRefs = textAreaRefs.current.filter((ref, index) => {
      return quizQuestions[index].id !== singleQuestion.id;
    });
    textAreaRefs.current = updatedRefs;
    setQuizQuestions(filterQuestionToDelete);
  }

  function handleInputChange(index, text) {
    const updatedQuestions = quizQuestions.map((question, i) => {
      if (index === i) {
        return { ...question, mainQuestion: text };
      }
      return question;
    });
    setQuizQuestions(updatedQuestions);
  }

  function updateTheChoicesArray(text , choiceIndex , questionIndex){

    const updatedQuestions = quizQuestions.map((question , i) => {
      if(questionIndex === i){
        const updatedChoices = question.choices.map((choice , j) => {
          if(choiceIndex === j){
            return prefixes[j] + '. ' + text;
          }else{
            return choice;
          }
        });
        return {...question, choices : updatedChoices};
      }

      return question;
    });
    setQuizQuestions(updatedQuestions);
  }

  function updateCorrectAnswer(text , questionIndex){
    const correctAnswerArray = ['A' , 'B' , 'C' , 'D'];
    const questionsCopy = [...quizQuestions];
    questionsCopy[questionIndex].correctAnswer = correctAnswerArray.indexOf(text);
    setQuizQuestions(questionsCopy);
  }

  useLayoutEffect(() => {
    if (endOfListRef.current) {
      // console.log(endOfListRef);
      setTimeout(() => {
        endOfListRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [quizQuestions]);
  console.log(quizQuestions);

  useEffect(() => {
    const lastTextAreaIndex = quizQuestions.length - 1;
    if (lastTextAreaIndex >= 0) {
      const lastTextArea = textAreaRefs.current[lastTextAreaIndex].current;
      if (lastTextArea && focus) {
        lastTextArea.focus();
      }
    }
  }, [quizQuestions.length, textAreaRefs.current])



  return (
    <div className='p-3 mt-6 flex justify-between border border-green-700 rounded-md'>
      <Toaster
        toastOptions={{
          className: '',
          duration: 1500,
          style: {
            padding: '12px',
          },
        }}
      />
      <div className='flex gap-2 flex-col w-full'>
        <div className='flex gap-2 items-center'>
          <div className='bg-green-700 px-4 py-1 rounded-md text-white'>2</div>
          <span className='font-bold'>Quiz Questions :</span>
        </div>

        {quizQuestions.map((singleQuestion, questionIndex) => (
          <div
            ref={
              quizQuestions.length - 1 === questionIndex ? endOfListRef : null
            }
            key={questionIndex}
            className='border ml-5 p-4 mt-4 border-green-700 border-opacity-50 rounded-md
            flex flex-col justify-center relative'
          >
            <SingleQuestion
              questionInex={questionIndex}
              value={singleQuestion.mainQuestion}
              ref={textAreaRefs.current[questionIndex]}
              onChange={(e) => {
                handleInputChange(questionIndex, e.target.value);
              }}
            />
            <Choices
              questionIndex={questionIndex}
              singleQuestion={singleQuestion}
              quizQuestions={quizQuestions}
              setQuizQuestions={setQuizQuestions}
              onChangeChoice={(text , choiceIndex , questionIndex) => {
                updateTheChoicesArray(text , choiceIndex , questionIndex);
              }}
              value = {singleQuestion.choices}
              prefixes={prefixes}
            />
            {questionIndex !== 0 && (
              <FontAwesomeIcon
                icon={faXmark}
                width={10}
                height={10}
                className='text-red-600 absolute top-2 cursor-pointer right-3 '
                onClick={() => {
                  deleteQuestion(singleQuestion);
                }}
              />
            )}
            <CorrectAnswer 
            onChangeCorrectAnswer={(text) => {
              updateCorrectAnswer(text , questionIndex);
            }}
            singleQuestion={singleQuestion}
            />
          </div>
        ))}

        <div className='w-full flex justify-center mt-3'>
          <button
            onClick={() => {
              addNewQuestion();
            }}
            className='p-3 bg-green-700 rounded-md text-white w-60 text-[13px]'
          >
            Add a New Question
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizBuildQuestions;

function CorrectAnswer({onChangeCorrectAnswer , singleQuestion}){
  const [correctAnswerInput , setCorrectAnswerInput] = useState(
    singleQuestion.correctAnswer,
  );
  const prefixes = ['A', 'B', 'C', 'D'];
  function handleOnChangeInput(text){
    const upperText = text.toUpperCase();
    for(const choice of singleQuestion.choices){
      const eachChoice = choice.substring(0,1);

      if( eachChoice === upperText || upperText === ''){
        setCorrectAnswerInput(upperText);
        onChangeCorrectAnswer(upperText);
      }
    }
  }
  return(
    <div className="flex gap-1 items-center mt-3">
      <div className='text-[15px]'>Correct Answer</div>
      <div className='border border-gray-200 rounded-md p-1 w-full'>
        <input 
        value={prefixes[correctAnswerInput]}
        maxLength={1}
        onChange={(e) => {
          handleOnChangeInput(e.target.value);
        }}
        className='p-3 outline-none w-full text-[13px]'
        placeholder='Add the correct answer.. A B C D'
        />
      </div>
    </div>
  );
}

const SingleQuestion = forwardRef(function SingleQuestion({ questionInex, value, onChange }, ref,) {
  return (
    <div className='w-full'>
      <div className='flex items-center gap-3'>
        <span>Question</span>
        <span>{questionInex + 1}</span>
      </div>
      <textarea
        className='border border-gray-200 rounded-md p-3 ml-3 w-full h-[50px] resize-none text-[13px] outline-none'
        placeholder='Your Question Here....'
        value={value}
        onChange={onChange}
        ref={ref}
      />
    </div>
  );
})
