
import { useContext } from 'react';
import { AuthContext } from '../context/userContext';
import AlreadyLogged from '../pages/AlreadyLogged';

const AlreadyLoggedIn = ({ children, path }: { children: JSX.Element, path: string }) => {
    const authContext = useContext(AuthContext)
    return authContext?.isAuthenticated ? <AlreadyLogged/> : children;
};

export default AlreadyLoggedIn;