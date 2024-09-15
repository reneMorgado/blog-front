import React from 'react'
import { Post } from '../interfaces/api'
import { Link } from 'react-router-dom'
import { formatDate } from '../helpers/format'
import { deletePost } from '../helpers/fetch';
import { errorAlert, succesAlert } from '../helpers/alerts';

interface PostCardProps {
    post: Post;
    admin?: boolean;
    handleDeletePost?: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, admin, handleDeletePost }) => {
    const getBlobImageURL = () => {
        try {
            const base64String = post.image.split(',')[1]; // Remove the data URL prefix if present
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Failed to decode base64 string:', error);
            return '';
        }
    }

    const onDeleteClick = async () => {
        if (handleDeletePost) {
            handleDeletePost(post.id);
        } else {
            errorAlert('Delete function is not defined', 'Error');
        }
    }

    return (
        <div className="max-w-md w-full h-96 bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
            <div className="">
                <p className='font-thin text-sm mb-2'>Creado por: {post.creatorName} el {formatDate(post.createdAt)}</p>
                <p className='font-semibold text-xl mb-4'>{post.title}</p>
                <img className='w-full max-w-md h-48 rounded-2xl mb-4 shadow-inner' src={getBlobImageURL()} alt={post.title} />
            </div>
            {admin ? <div className="flex">
                <Link className='btn-primary mr-4' to={`/edit-post/${post.id}`}>Editar</Link>
                <button className='btn-secondary' onClick={onDeleteClick}>Eliminar</button>
            </div> : <Link className='btn-primary' to={`/post/${post.id}`}>Leer más</Link>}

        </div>
    )
}

export default PostCard