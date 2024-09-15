import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AlreadyLoggedIn from './middlewares/AlreadyLoggedIn';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import { AuthContext } from './context/userContext';
import { useEffect, useState } from 'react';
import { getPermissions, fetchUserDataFromToken } from './helpers/fetch';
import Admin from './pages/Admin';
import IsAdmin from './middlewares/IsAdmin';
import AddPost from './pages/AddPost';
import EditPost from './pages/EditPost';
import Comments from './pages/Comments';

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
					<Route path="/" element={<Landing />} />
					<Route path="/login" element={
						<AlreadyLoggedIn path='/blog'>
							<Login />
						</AlreadyLoggedIn>
					} />
					<Route path='/register' element={
						<AlreadyLoggedIn path='/blog'>
							<Register />
						</AlreadyLoggedIn>
					} />
					<Route path='/blog' element={
						<Blog />
					} />
					<Route path='/post/:id' element={
						<BlogDetail />
					} />
					<Route path='/admin' element={
						<IsAdmin>
							<Admin />
						</IsAdmin>
					} />
					<Route path='/add-post' element={
						<IsAdmin>
							<AddPost />
						</IsAdmin>
					} />
					<Route path='/edit-post/:id' element={
						<IsAdmin>
							<EditPost />
						</IsAdmin>
					} />
					<Route path='/comments' element={
						<IsAdmin>
							<Comments />
						</IsAdmin>
					} />
				</Routes>

			</AuthContext.Provider>
		</Router>
	);
}

export default App;
