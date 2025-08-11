import React from 'react';
import { Link } from 'react-router';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[url(./404.jpg)] bg-center text-white">
            <Link to="/">
                <button className="btn btn-primary">
                    Go to Home
                </button>
            </Link>
        </div>
    );
};

export default NotFound;