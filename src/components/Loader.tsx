import React from 'react'
import './Loader.scss'

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen w-screen fixed top-0 left-0 bg-white overflow-hidden overflow-y-hidden">
            <div className="loader">
                <svg viewBox="0 0 100 20">
                    <circle className="circle" cx="15" cy="10" r="10"></circle>
                    <circle className="circle" cx="50" cy="10" r="10"></circle>
                    <circle className="circle" cx="85" cy="10" r="10"></circle>
                </svg>
            </div>
        </div>
    )
}

export default Loader