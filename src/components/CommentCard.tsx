import React from 'react'
import { CommentCardProps } from '../interfaces/api';
import { formatDate } from '../helpers/format';
import { approveComment, discardComment } from '../helpers/fetch';
import { errorAlert, succesAlert } from '../helpers/alerts';



const CommentCard: React.FC<CommentCardProps> = ({ permissions, comment }) => {

    const hanldeApproveComment =  async() => {
        const response = await approveComment(comment.id);
        if(response.status === 200) {
            succesAlert('Comentario aprobado correctamente!', '');
        } else { 
            errorAlert('Error al aprobar comentario', '');
        }
    }

    const hanldeDiscardComment = async () => {
        const response = await discardComment(comment.id);
        if(response.status === 200) {
            succesAlert('Comentario eliminado correctamente!', '');
        } else { 
            errorAlert('Error al aprobar comentario', '');
        }
    }

    return (
        <div className={'my-4 rounded-lg shadow-md p-4 ' + (comment.approved ? 'bg-gray-100' : 'bg-yellow-100')}>
            <div className="flex flex-col md:flex-row  md:justify-between mb-4">
                <div className="">
                    <p className='text-sm font-light'>{comment.creatorName}, el {formatDate(comment.createdAt)}</p>
                    {comment.postTitle && <p className='text-sm font-light'>En: {comment.postTitle}</p>}

                </div>
                {!comment.approved && <p className='text-sm font-light mt-2 md:mt-0'>Pendiente de aprobación</p>}
            </div>
            <p className='normal-font mb-4'>{comment.content}</p>
            <p></p>
            {permissions.includes('ADMIN') && !comment.approved && <button className='btn-primary mr-4' onClick={hanldeApproveComment}>Aprobar</button>}
            {permissions.includes('ADMIN') && !comment.approved && <button className='btn-secondary' onClick={hanldeDiscardComment}>Descartar</button>}
        </div>
    )
}

export default CommentCard