import { lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/userContext';
import { Suspense, useEffect, useState } from 'react';
import { getPermissions, fetchUserDataFromToken } from './helpers/fetch';
import Loader from './components/Loader';
import './App.scss';
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AlreadyLoggedIn = lazy(() => import('./middlewares/AlreadyLoggedIn'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Admin = lazy(() => import('./pages/Admin'));
const IsAdmin = lazy(() => import('./middlewares/IsAdmin'));
const AddPost = lazy(() => import('./pages/AddPost'));
const EditPost = lazy(() => import('./pages/EditPost'));
const Comments = lazy(() => import('./pages/Comments'));


function App() {

	const [permissions, setPermissions] = useState<string[]>([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [token, setToken] = useState('');
	const [typeOfUser, setTypeOfUser] = useState('invited');
	const [userId, setUserId] = useState('');
	const [userName, setUserName] = useState('');

	useEffect(() => {
		const token = localStorage.getItem('token') || "";
		setToken(token);
		setIsAuthenticated(token !== "")
		fetchUserData(token)
	}, [])

	const fetchUserData = async (token: string) => {
		await getPermissions(token).then(permissions => setPermissions(permissions.message));
		await fetchUserDataFromToken(token).then(userData => { setUserId(userData.id); setUserName(userData.name); });
	}

	useEffect(() => {
		fetchUserData(token);
	}, [token]);

	useEffect(() => {
		const type = permissions.includes('COMMENT') ? (permissions.includes('ADMIN') ? 'admin' : 'user') : 'invited';
		setTypeOfUser(type);
	}, [permissions])

	return (
		<Router>
			<AuthContext.Provider value={{ isAuthenticated: isAuthenticated, permissions: permissions, token: token, setToken: setToken, setIsAuthenticated: setIsAuthenticated, typeOfUser: typeOfUser, userId: userId, userName: userName }}>
				<Routes>
					<Route path="/" element={
						<Suspense fallback={<Loader />}>
							<Landing />
						</Suspense>
					} />
					<Route path="/login" element={
						<Suspense fallback={<Loader />}>
							<AlreadyLoggedIn path='/blog'>
								<Login />
							</AlreadyLoggedIn>
						</Suspense>
					} />
					<Route path='/register' element={
						<Suspense fallback={<Loader />}>
							<AlreadyLoggedIn path='/blog'>
								<Register />
							</AlreadyLoggedIn>
						</Suspense>
					} />
					<Route path='/blog' element={
						<Suspense fallback={<Loader />}>
							<Blog />
						</Suspense>
					} />
					<Route path='/post/:id' element={
						<Suspense fallback={<Loader />}>
							<BlogDetail />
						</Suspense>
					} />
					<Route path='/admin' element={
						<Suspense fallback={<Loader />}>
							<IsAdmin>
								<Admin />
							</IsAdmin>
						</Suspense>
					} />
					<Route path='/add-post' element={
						<Suspense fallback={<Loader />}>
							<IsAdmin>
								<AddPost />
							</IsAdmin>
						</Suspense>
					} />
					<Route path='/edit-post/:id' element={
						<Suspense fallback={<Loader />}>
							<IsAdmin>
								<EditPost />
							</IsAdmin>
						</Suspense>
					} />
					<Route path='/comments' element={
						<Suspense fallback={<Loader />}>
							<IsAdmin>
								<Comments />
							</IsAdmin>
						</Suspense>
					} />
				</Routes>

			</AuthContext.Provider>
		</Router>
	);
}

export default App;
