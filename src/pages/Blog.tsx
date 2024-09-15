import { useContext, useEffect } from 'react'
import { fetchPosts, logout } from '../helpers/fetch';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Post, PostsResponse } from '../interfaces/api';
import PostCard from '../components/PostCard';
import { AuthContext } from '../context/userContext';
import Header from '../components/Header';
import Loader from '../components/Loader';

const Blog = () => {

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);

    const authContext = useContext(AuthContext);

    const navigate = useNavigate();


    const closeSession = async () => {
        setLoading(true)
        try {
            await logout();
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
        localStorage.removeItem('token');
        authContext?.setIsAuthenticated(false);
        authContext?.setToken('');
        navigate('/');
    }

    const getPosts = async () => {
        try {
            const response: PostsResponse = await fetchPosts()
            setPosts(response.posts);
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    useEffect(() => {
        setLoading(true)
        getPosts();
    }, []);

    if(loading) return <Loader/>


    return (
        <div className="container">
            <Header/>
            {authContext?.isAuthenticated ? 
                <button className='w-full p-6 shadow bg-gray-100 font-thin text-primary' onClick={closeSession}>Cerrar sesión</button> 
            : 
                <p className='w-full p-6 shadow bg-gray-100 font-thin text-center'>Estás visitando la página como invitado, <Link className='link' to="/register">Regístrate</Link> o <Link className='link' to="/login">Inicia sesión</Link> para la experiencia completa</p>
            }
            <div className='p-8 background-login-register'>
                <p className='title mb-4 mt-4 font-light'>Publicaciones recientes:</p>
                <div className="flex gap-4 flex-wrap">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>

    )
}

export default Blog