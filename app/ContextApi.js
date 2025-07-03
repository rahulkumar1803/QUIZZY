'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { quizzesData } from "./QuizzesData";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const GlobalContext = createContext();

export function ContextProvider({ children }) {
  const defaultUser = {
    id: 1,
    name: 'QuizUser',
    isLogged: false,
    experience: 0,
  };

  const [allQuizzes, setAllQuizzes] = useState([]);
  const [selectQuizToStart, setSelectQuizToStart] = useState(null);
  const [user, setUser] = useState(defaultUser);
  
  // Load user from localStorage on client-side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserData = localStorage.getItem('user');
      if (savedUserData) {
        setUser(JSON.parse(savedUserData));
      }
    }
  }, []);
  
  const [openIconBox , setOpenIconBox] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState({faIcon: faQuestion});
  const [dropDownToggle, setDropDownToggle] = useState(false);
  const [threeDotsPositions, setThreeDotsPositions] = useState({x: 0, y: 0});
  const [selectedQuiz , setSelectedQuiz ] = useState(null);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  // Load quizzes once on mount
  useEffect(() => {
    const fetchAllQuizzes = async () => {
      try{
        const response = await fetch('http://localhost:3000/api/quizzes' , {
          cache: 'no-cache',
        });
        if(!response.ok){
          toast.error('Something Went Wrong...');
          throw new Error('fetching failed...');
        }

        const quizzesData = await response.json();
        
        setAllQuizzes(quizzesData.quizzes);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllQuizzes();
  }, []);

  useEffect(() => {
    if(selectedQuiz){
      setSelectedIcon({faIcon: selectedQuiz.icon});
    } else{
      setSelectedIcon({faIcon: faQuestion});
    }
  }, [selectedQuiz])
  

  return (
    <GlobalContext.Provider value={{
      allQuizzes,
      setAllQuizzes,
      quizToStartObject: { selectQuizToStart, setSelectQuizToStart },
      userObject: { user, setUser },
      openBoxToggle: {openIconBox , setOpenIconBox },
      selectedIconObject: { selectedIcon , setSelectedIcon },
      dropDownToggleObject: { dropDownToggle, setDropDownToggle },
      threeDotsPositionsObject :  {threeDotsPositions, setThreeDotsPositions},
      selectedQuizObject : {selectedQuiz , setSelectedQuiz },
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default function useGlobalContextProvider() {
  return useContext(GlobalContext);
}
