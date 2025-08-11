import React from 'react';
import { Link } from 'react-router';

const NotFound = () => {
    return (
        <>
        <div className='md:flex md:justify-between md:items-center'>
            <div className='md:w-1/2 invisible md:visible'>
                <h1 className="text-4xl font-bold text-center mt-20">404 - Page Not Found</h1>
                <p className="text-center mt-4">The page you are looking for does not exist.</p>
                <p className="text-center mt-2">Please check the URL or return to the .</p>
            </div>
            <div className='md:w-1/2'>
                <img
                    src="/404.jpg"
                    alt="Not Found"
                    className="mx-auto md:mt-10 md:w-1/2 "
                />
            </div>
        </div>
            <div className='flex items-center justify-center'>
                <Link to="/"><button className='btn btn-primary w-[160px] mt-10'>Go to home</button></Link>
            </div>
        </>
    );
};

export default NotFound;