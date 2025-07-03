import React from 'react'
import Image from 'next/image'
import useGlobalContextProvider from '../ContextApi';
import { useRouter } from 'next/navigation';

function PlaceHolder(props) {
    const { userObject } = useGlobalContextProvider();
    const { user, setUser } = userObject;
    const router = useRouter();
    return (
        <div className='poppins flex-col gap-3 p-4 flex justify-center items-center'>
            {/* Image Container */}
            <Image src="/emptyBox.png" alt='' width={130} height={130} />
            {/* Title */}
            <h2 className='text-2xl font-bold'>Quizzes await! make one.</h2>
            {/* Call to Action */}
            <span className='text-[13px] font-light'>
                Click below to begin your joureny here ...
            </span>
            {/* buttons */}
            <button
                onClick={() => {
                    router.push('/quiz-build');
                }}
                className='p-3 px-4 text-white text-[12px] bg-green-700 rounded-md'
            >
                Create my first Quiz
            </button>
        </div>
    );
}

export default PlaceHolder