'use client';

import React, { useEffect, useState } from 'react';
import QuizBuildTitle from '../components/QuizBuildPage/QuizBuildTitle';
import QuizBuildNav from '../components/QuizBuildPage/QuizBuildNav';
import QuizBuildQuestions from '../components/QuizBuildPage/QuizBuildQuestions';
import { v4 as uuidv4 } from 'uuid';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import IconsComponents from '../components/QuizBuildPage/IconsComponents';
import useGlobalContextProvider from '../ContextApi';

function page() {
  const prefixes = ['A', 'B', 'C', 'D'];
  const { selectedIconObject, selectedQuizObject } = useGlobalContextProvider();
  const { selectedIcon } = selectedIconObject;
  const { selectedQuiz } = selectedQuizObject;
  const [focusFirst, setFocusFirst] = useState(true);

  const [quizQuestions, setQuizQuestions] = useState(() => {
    if (selectedQuiz) {
      return selectedQuiz.quizQuestions;
    } else {
      return [
        {
          id: uuidv4(),
          mainQuestion: '',
          choices: prefixes.slice(0, 2).map((prefix) => prefix + '. '),
          correctAnswer: '',
          answeredResult: -1,
          statistics: {
            totalAttempts: 0,
            correctAttempts: 0,
            incorrectAttempts: 0,
          },
        },
      ]
    }
  });

  const [newQuiz, setNewQuiz] = useState(() => {
    if (selectedQuiz) {
      return selectedQuiz;
    } else {
      return {
        id: uuidv4(),
        icon: selectedIcon.faIcon,
        quizTitle: '',
        quizQuestions: quizQuestions,
      }
    }
  });

  useEffect(() => {
    setNewQuiz((prevQuiz) => ({
      ...prevQuiz,
      icon: selectedIcon.faIcon,
      quizQuestions: quizQuestions,
    }));
  }, [quizQuestions, selectedIcon.faIcon]);

  // 🟢 This function ensures quizTitle is updated
  const handleSetQuizTitle = (title) => {
    setNewQuiz((prev) => ({ ...prev, quizTitle: title }));
  };

  const quizNavBarProp = {
    quizQuestions,
    newQuiz,
    setNewQuiz,
  };

  const quizTitleProps = {
    focusProp: { focus: focusFirst, setFocusFirst },
    quizTitle: newQuiz.quizTitle,
    handleSetQuizTitle,
  };

  const quizQuestionsProps = {
    focusProp: { focus: !focusFirst, setFocusFirst },
    quizQuestions,
    setQuizQuestions,
  };

  return (
    <div className="relative mx-16 poppins">
      <IconsComponents />
      <QuizBuildNav {...quizNavBarProp} />
      <QuizBuildTitle {...quizTitleProps} />
      <QuizBuildQuestions {...quizQuestionsProps} />
    </div>
  );
}

export default page;
