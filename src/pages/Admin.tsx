import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { Post, PostsResponse } from '../interfaces/api'
import { deletePost, fetchPosts } from '../helpers/fetch'
import { errorAlert, succesAlert } from '../helpers/alerts'
import PostCard from '../components/PostCard'

const Admin = () => {

    const [posts, setPosts] = React.useState<Post[]>([]);

    const getPosts = async () => {
        const response: PostsResponse = await fetchPosts()
        setPosts(response.posts);
    }

    useEffect(() => {
        getPosts();
    }, []);

    const handleDeletePost = async (id: string) => {
        const response = await deletePost(id);
        if (response.status === 200) {
            succesAlert('Publicación eliminada con éxito', '');
        } else {
            errorAlert('No se pudo eliminar la publicación', '');
        }
        getPosts(); // Refresh the posts list after deleting
    }

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