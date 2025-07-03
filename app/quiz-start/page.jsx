'use client';

import React, { useEffect, useState } from 'react';
import useGlobalContextProvider from '../ContextApi';
import QuizStartQuestions from '../components/QuizStartPage/QuizStartQuestions';
import QuizStartHeader from '../components/QuizStartPage/QuizStartHeader';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function Page() {
  const { quizToStartObject } = useGlobalContextProvider();
  const { selectQuizToStart } = quizToStartObject;
  const [parentTimer, setParentTimer] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (selectQuizToStart === null) {
      router.push('/');
    }
  }, []);

  function onUpdateTime(currentTime) {
    setParentTimer(currentTime);
  }

  return (
    <div className='poppins flex flex-col px-24 mt-[35px]'>
      {selectQuizToStart === null ? (
        <div className="h-svh flex flex-col gap-2 items-center justify-center">
          <Image src="/errorIcon.png" alt="" width={180} height={180} />
          <h2 className="text-xl font-bold">Please Select your quiz first...</h2>
          <span className="font-light">You will be redirected to the home page</span>
        </div>
      ) : (
        <>
          <QuizStartHeader parentTimer={parentTimer} />
          <div className='mt-10 flex items-center justify-center'>
            <QuizStartQuestions onUpdateTime={onUpdateTime} />
          </div>
        </>
      )}
    </div>
  );
}

export default Page;
