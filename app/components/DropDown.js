'use client';

import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import useGlobalContextProvider from '../ContextApi';
import { useRouter } from 'next/navigation';

function DropDown() {
  const {
    dropDownToggleObject,
    threeDotsPositionsObject,
    selectedQuizObject,
    allQuizzes,
    setAllQuizzes,
  } = useGlobalContextProvider();

  const { dropDownToggle, setDropDownToggle } = dropDownToggleObject;
  const { threeDotsPositions } = threeDotsPositionsObject;
  const { selectedQuiz, setSelectedQuiz } = selectedQuizObject;

  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const dropDownRef = useRef(null);
  const router = useRouter();

  const menuItems = [
    { name: 'Modify', icon: faPencil },
    { name: 'Delete', icon: faTrash },
  ];

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target)
      ) {
        setDropDownToggle(false);

        // Delay clearing selectedQuiz to allow Delete button to trigger toast
        if (!isDialogOpened) {
          setTimeout(() => {
            setSelectedQuiz(null);
          }, 100);
        }
      }
    }

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [dropDownToggle, isDialogOpened]);



 async function deleteTheQuiz (){
    const updatedAllQuizzes = allQuizzes.filter((quiz) => {
        if(quiz._id !== selectedQuiz._id){
            return quiz;
        }
    });

    console.log(selectedQuiz._id);

    const res = await fetch(
      `api/quizzes?id=${selectedQuiz._id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      },
    );

    if(!res.ok){
      toast.error('Erroe while deleting the Quiz');
      return;
    }

    setAllQuizzes(updatedAllQuizzes);
    toast.success('The Quiz has been deleted successfully.');
    setIsDialogOpened(false);
    setSelectedQuiz(null);
  }

  function handleClickedItem(menuItem) {

    setDropDownToggle(false);

    if (menuItem.name === 'Modify') {
      router.push('/quiz-build');
    }

    if (menuItem.name === 'Delete') {
      if (!selectedQuiz) {
        console.warn('No selected quiz to delete');
        return;
      }

      setIsDialogOpened(true);

      requestAnimationFrame(() => {
        toast(
          (t) => (
            <div className="flex flex-col gap-4">
              <div>
                Do you really want to delete <strong>({selectedQuiz.quizTitle})</strong> Quiz?
              </div>
              <div className="w-full flex gap-3 justify-center">
                <button
                  onClick={() => {
                    // Confirm delete
                    deleteTheQuiz();
                    toast.dismiss(t.id);
                    // TODO: delete logic here (API call etc.)
                  }}
                  className="bg-green-700 text-white p-1 w-[100px] rounded-md"
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    setIsDialogOpened(false);
                    setSelectedQuiz(null);
                  }}
                  className="bg-white text-green-700 p-1 w-[100px] border border-green-700 rounded-md hover:text-white hover:bg-green-700"
                >
                  No
                </button>
              </div>
            </div>
          ),
          {
            duration: 10000,
            id: 'deleteQuiz',
          }
        );
      });
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <div
        ref={dropDownRef}
        style={{ left: threeDotsPositions.x, top: threeDotsPositions.y }}
        className={`p-4 w-32 fixed z-50 shadow-md flex rounded-lg flex-col gap-3 bg-white
        poppins poppins-light text-[13px] transition-all duration-150 ease-in-out
        ${dropDownToggle ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        {menuItems.map((menuItem, index) => (
          <div
            key={index}
            onClick={() => handleClickedItem(menuItem)}
            className="flex gap-2 items-center border text-green-700 border-gray-200 rounded-md p-3
              select-none cursor-pointer hover:text-white hover:bg-green-700"
          >
            <FontAwesomeIcon icon={menuItem.icon} />
            <div>{menuItem.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default DropDown;
