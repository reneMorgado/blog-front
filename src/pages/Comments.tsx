import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/Header'
import { equalTo, get, onValue, orderByChild, query, ref } from 'firebase/database';
import db from '../helpers/firebase';
import { AuthContext } from '../context/userContext';
import { Link } from 'react-router-dom';
import { Comment } from '../interfaces/api';
import CommentCard from '../components/CommentCard';

const Comments = () => {

    const authContext = useContext(AuthContext)
    const [showedComments, setShowedComments] = useState<Comment[]>([]);

    const getUnapprovedComments = () => {
        const commentsRef = query(ref(db, 'comments'), orderByChild('approved'), equalTo(false));
        onValue(commentsRef, async (snapshot) => {
            const docs = snapshot.val();
            if (!docs) {
                setShowedComments([]);
                return;
            }
            const comments: Comment[] = [];
            await Promise.all(
                Object.keys(docs).map(async (key) => {
                    const comment: Comment = { id: key, ...docs[key], creatorName: '' };
                    const userRef = ref(db, `users/${comment.creator}`);
                    const postRef = ref(db, `posts/${comment.postId}`);
                    const userSnapshot = await get(userRef);
                    const postSnapshot = await get(postRef);
                    const user = userSnapshot.val();
                    const post = postSnapshot.val();
                    comment.postTitle = post?.title;
                    comment.creatorName = user?.username;
                    comments.push(comment);
                })
            );
            setShowedComments(comments);
        });
    }

    useEffect(() => {
        getUnapprovedComments()
    }, [authContext?.typeOfUser])
    return (
        <div className="container">
            <Header />
            <div className="w-full flex flex-col">
                <Link className='w-full p-6 shadow bg-gray-100 font-thin text-primary text-center' to="/admin">Volver al Panel de Administración</Link>
                <div className="background-login-register w-full flex flex-col p-8">
                    <h3 className='title mb-4 mt-4'>Comentarios pendientes de aprobación:</h3>
                    {showedComments.length > 0 ? showedComments.map((comment: Comment) => (
                        <CommentCard key={comment.id} comment={comment} permissions={authContext?.permissions as string[]} />
                    )): <p className='normal-font'>No hay comentarios pendientes de aprobación.</p>}
                    
                </div>

            </div>
        </div>
    )
}

export default Comments