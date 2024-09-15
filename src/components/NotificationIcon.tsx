import React from 'react'
import NotiSvg from '../images/icons/notification.svg'

const NotificationIcon = ({ counter }: { counter: number }) => {
    return (
        <div className='absolute flex items-center'>
            <img className='w-6 h-6' src={NotiSvg} alt='Notification' />
            {counter > 0 && <p className='absolute top-0 left-3 bg-red-600 w-4 h-4 flex justify-center rounded-lg text-white'>{counter}</p>}
        </div>
    )
}

export default NotificationIcon