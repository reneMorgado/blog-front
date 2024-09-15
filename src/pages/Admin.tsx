import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { Post, PostsResponse } from '../interfaces/api'
import { deletePost, fetchPosts } from '../helpers/fetch'
import { errorAlert, succesAlert } from '../helpers/alerts'
import PostCard from '../components/PostCard'
import Loader from '../components/Loader'

const Admin = () => {

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);

    const getPosts = async () => {
        setLoading(true);
        try {
            const response: PostsResponse = await fetchPosts()
            setPosts(response.posts);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPosts();
    }, []);

    const handleDeletePost = async (id: string) => {
        setLoading(true); 
        const response = await deletePost(id);
        if (response.status === 200) {
            setLoading(false);
            succesAlert('Publicación eliminada con éxito', '');
        } else {
            setLoading(false);
            errorAlert('No se pudo eliminar la publicación', '');
        }
        getPosts(); // Refresh the posts list after deleting
    }

    if(loading) return <Loader/>

    return (
        <div className='container'>
            <Header />
            <div className="background-login-register p-4">
                <div className="w-full py-8 flex justify-center">
                    <Link className='btn-secondary mr-4' to="/comments">Gestionar comentarios</Link>
                    <Link className='btn-secondary' to="/add-post">Añadir nueva publicación</Link>
                </div>
                <h3 className='title font-light mb-4'>Publicaciones:</h3>
                <div className="flex gap-4 flex-wrap">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} admin handleDeletePost={handleDeletePost} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Admin