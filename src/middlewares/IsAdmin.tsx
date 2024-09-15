import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/userContext';
import Unauthorized from '../pages/Unauthorized';

const IsAdmin = ({ children }: { children: JSX.Element }) => {
    const authContext = useContext(AuthContext);
    return authContext?.typeOfUser === 'admin' ? children : <Unauthorized />;
};

export default IsAdmin;