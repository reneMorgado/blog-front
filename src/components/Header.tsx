import React, { useContext, useEffect, useState } from 'react'
import logo from '../images/logo.png'
import { AuthContext } from '../context/userContext'
import { Link } from 'react-router-dom'
import { equalTo, onChildAdded, onValue, orderByChild, query, ref } from 'firebase/database'
import db from '../helpers/firebase'
import NotificationIcon from './NotificationIcon'

const Header = () => {

	const authContext = useContext(AuthContext)
	const [counter, setCounter] = useState(0)

	const counterNotifications = () => {
		const commentsRef = query(ref(db, 'comments'), orderByChild('approved'), equalTo(false));

		onValue(commentsRef, (snapshot) => {

			setCounter(snapshot.size);
		});
	}

	useEffect(() => {
		if (authContext?.typeOfUser === 'admin') {
			counterNotifications()
		}
	}, [authContext?.typeOfUser])

	return (
		<div className={'w-full items-center flex justify-around sm:justify-between shadow-md container flex-col sm:flex-row sm:h-20 ' + (authContext?.typeOfUser === 'admin' ? 'h-28' : 'h-12')}>
			<Link to='/blog' className='font-bold text-3xl ml-0 sm:ml-10'>
				<p>Blog Educativo</p>
			</Link>
			<div className="mr-10 flex">
				{authContext?.permissions.includes('ADMIN') && <Link to='/admin' className='h-6 flex items-center'>Panel de Administración</Link>}
				{authContext?.permissions.includes('ADMIN') && <Link to='/comments' className='ml-4'>
					<NotificationIcon counter={counter as number} />
				</Link>}
			</div>
		</div>
	)
}

export default Header