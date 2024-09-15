import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Comment, Post } from '../interfaces/api';
import { approveComment, fetchPost, postComment } from '../helpers/fetch';
import { errorAlert, succesAlert } from '../helpers/alerts';
import { formatDate } from '../helpers/format';
import CommentCard from '../components/CommentCard';
import { AuthContext } from '../context/userContext';
import { onValue, orderByChild, query, ref, equalTo, get, onChildChanged, onChildRemoved } from 'firebase/database';
import db from '../helpers/firebase';
import { sendNotification } from '../helpers/notifications';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Header from '../components/Header';
import Loader from '../components/Loader';

const BlogDetail = () => {

    const [showedComments, setShowedComments] = useState<any[]>([]);
    const [post, setPost] = useState<Post>();
    const [commentSize, setCommentSize] = useState(0);
    const [loading, setLoading] = useState(false);

    const authContext = useContext(AuthContext);
    const { id } = useParams();

    useEffect(() => {
        getPost()
        setShowedComments([]);
        getCommentsByTypeOfUser(authContext?.typeOfUser as string);
    }, [authContext]);

    const getCommentsByTypeOfUser = (type: string) => {
        setLoading(true)
        const commentsByType: { [key: string]: () => void } = {
            'admin': () => {
                const approvedCommentsRef = query(ref(db, 'comments'), orderByChild('postId'), equalTo(id as string));
                onValue(approvedCommentsRef, async (snapshot) => {
                    const data = snapshot.val();
                    if (!data) {
                        setShowedComments([]);
                        return;
                    }
                    const comments: Comment[] = [];
                    await Promise.all(
                        Object.keys(data).map(async (key) => {
                            const comment: Comment = { id: key, ...data[key], creatorName: '' };
                            const userRef = ref(db, `users/${comment.creator}`);
                            const userSnapshot = await get(userRef);
                            const user = userSnapshot.val();
                            comment.creatorName = user?.username;
                            comments.push(comment);
                        })
                    );
                    setShowedComments(comments);
                    setCommentSize((count) => {
                        if (comments.length === count + 1) {
                            const newComment = comments[comments.length - 1];
                            approveComment(newComment.id).then((response) => {});
                        }
                        return comments.length
                    });
                });
            },
            'user': () => {
                const approvedCommentsRef = query(ref(db, 'comments'), orderByChild('postId'), equalTo(id as string));
                onValue(approvedCommentsRef, async (snapshot) => {
                    const data = snapshot.val();
                    if (!data) {
                        setShowedComments([]);
                        return;
                    }
                    const comments: Comment[] = [];
                    await Promise.all(
                        Object.keys(data).map(async (key) => {
                            const comment: Comment = { id: key, ...data[key], creatorName: '' };
                            const userRef = ref(db, `users/${comment.creator}`);
                            const userSnapshot = await get(userRef);
                            const user = userSnapshot.val();
                            comment.creatorName = user?.username;
                            if (comment.approved || comment.creator === authContext?.userId) {
                                comments.push(comment);
                            }
                        })
                    );

                    setShowedComments(comments);
                });
                onChildChanged(approvedCommentsRef, async (snapshot) => {
                    if(type === 'user' && authContext?.userId === snapshot.val().creator) {
                        console.log(authContext)
                        sendNotification('Tu comentario se ha aprobado!');
                    }
                });
                onChildRemoved(approvedCommentsRef, async (snapshot) => {
                    if(type === 'user' && authContext?.userId === snapshot.val().creator) {
                        sendNotification('Tu comentario se ha eliminado!');
                    }
                });
            },
            'invited': () => {
                const approvedCommentsRef = query(ref(db, 'comments'), orderByChild('postId'), equalTo(id as string));
                onValue(approvedCommentsRef, async (snapshot) => {
                    const data = snapshot.val();
                    if (!data) {
                        setShowedComments([]);
                        return;
                    }
                    const comments: Comment[] = [];
                    await Promise.all(
                        Object.keys(data).map(async (key) => {
                            const comment: Comment = { id: key, ...data[key], creatorName: '' };
                            const userRef = ref(db, `users/${comment.creator}`);
                            const userSnapshot = await get(userRef);
                            const user = userSnapshot.val();
                            comment.creatorName = user?.username;
                            if (comment.approved) {
                                comments.push(comment);
                            }
                        })
                    );
                    setShowedComments(comments);
                });
            }
        }
        setLoading(false)
        commentsByType[type]();
    }

    const getPost = async () => {
        if (id) {
            setLoading(true)
            const response = await fetchPost(id);
            if (response === undefined) {
                setLoading(false)
                errorAlert('No se pudo cargar el post', 'Error');
            } else {
                setLoading(false)
                setPost(response);
            }
        }
    }

    const initialValues = { 'content': '' }

    const validationSchema = Yup.object({
        content: Yup.string().min(4).max(60).required('Campo requerido'),
    });

    const onSubmit = async (values: any) => {
        setLoading(true)
        const newComment = { postId: id, ...values }
        const response = await postComment(newComment);
        if (response.status === 200) {
            setLoading(false)
            succesAlert('Comentario enviado correctamente!', 'Gracias por tu comentario');
        } else {
            setLoading(false)
            errorAlert('No se pudo enviar el comentario', 'Error');
        }

    };

    const getBlobImageURL = () => {
        try {
            const base64String = post?.image.split(',')[1]; // Remove the data URL prefix if present
            const byteCharacters = atob(base64String as string);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            return URL.createObjectURL(blob);
        } catch (error) {
            return '';
        }
    }

    if(loading) return <Loader/>

    return (
        <div className="container">
            <Header />
            <div className="w-full flex flex-col">
                {authContext?.isAuthenticated ?
                    <Link className='w-full p-6 shadow bg-gray-100 font-thin text-primary text-center' to="/blog">Volver al blog</Link>
                    :
                    <p className='w-full p-6 shadow bg-gray-100 font-thin text-center'>Estás visitando la página como invitado, <Link className='link' to="/register">Regístrate</Link> o <Link className='link' to="/login">Inicia sesión</Link> para la experiencia completa</p>
                }

            </div>
            <div className="p-8 background-login-register">
                <p className='title mb-4 font-light'>{post?.title}</p>
                <p className='normal-font'>Autor: {post?.creatorName}</p>
                <p className='normal-font mb-4'>{formatDate(post?.createdAt as string)}</p>
                <div className="w-full flex justify-center rounded-md shadow-inner">
                    <img className='rounded-md max-w-md w-full' src={getBlobImageURL()} alt={post?.title} />
                </div>
                <p className='my-4' dangerouslySetInnerHTML={{ __html: post?.content || '' }}></p>
                <p className='subtitle'>Comentarios:</p>
                {showedComments.map((comment: Comment) => (
                    <CommentCard key={comment.id} comment={comment} permissions={authContext?.permissions as string[]} />
                ))}
                {authContext?.permissions.includes('COMMENT') ? <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    <Form className='comment-box mt-4'>
                        <p className='normal-font'>Únete a la conversacion!</p>
                        <div className='input-container max-w-96'>
                            <label className='input-label' htmlFor="content">Agrega un comentario</label>
                            <Field className="input-form" type="text" id="content" name="content" />
                            <ErrorMessage className='input-helper' name="content" component="div" />
                        </div>
                        <button className='btn-primary' type="submit">Enviar comentario</button>
                    </Form>
                </Formik> : <p className='font-thin text-center'><Link className='link' to="/register">Regístrate</Link> o <Link className='link' to="/login">Inicia sesión</Link> para poder hacer comentarios</p>}
            </div>

        </div>
    )
}

export default BlogDetail