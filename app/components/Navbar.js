import React, { use } from 'react'
import Image from 'next/image';
import useGlobalContextProvider from '../ContextApi';

function Navbar(props) {
    const { userObject } = useGlobalContextProvider();
    const { user, setUser } = userObject;

    return (
        <nav className='poppins mx-auto max-w-screen-xl p-4 sm:px-8 sm:py-5 lg:px-10'>
            <div className="sm:flex sm:items-center sm:justify-between">
                <div className='text-center sm:text-left'>
                    <a className='flex gap-1 items-center'>
                        <Image
                            src="/quizSpark_icon.png"
                            alt=''
                            width={60}
                            height={60}
                        />
                        <h2 className='text-2xl font-bold flex gap-2'>
                            Quiz <span className='text-green-700'>Spark</span>
                        </h2>
                    </a>
                </div>

                <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                        <div className={`flex gap-2 ${user.isLogged ? 'visible' : 'invisible'}`} >
                            <span>Welcome: {user?.name || 'Guest'}</span>
                            <span className="font-bold text-green-700">
                            </span>
                        </div>
                    <button className='block rounded-lg bg-green-700 px-7 py-3 text-sm font-medium text-white cursor-pointer'
                        type='button'
                        onClick={() => {
                            setUser((prevUser) => ({ ...prevUser, isLogged: !user.isLogged }));
                        }}
                    >
                        {user.isLogged ? `Logout` : `Login`}
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar