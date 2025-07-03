'use client';
import Navbar from "./components/Navbar";
import QuizzesArea from "./components/QuizzesArea";
import { useEffect } from "react";
import useGlobalContextProvider from "./ContextApi";


export default function Home() {
  const { quizToStartObject } = useGlobalContextProvider();
  const { setSelectQuizToStart } = quizToStartObject;

  useEffect(() => {
    setSelectQuizToStart(null);
  }, [])
  
  return (
    <div className="">
      <header>
        <Navbar/>
      </header>
      <QuizzesArea/>
    </div>
  );
}
