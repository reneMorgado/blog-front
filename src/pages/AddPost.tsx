import React, { useState } from 'react'
import Header from '../components/Header'
import { addPost } from '../helpers/fetch';
import { errorAlert, succesAlert } from '../helpers/alerts';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/userContext';
import { formatDate } from '../helpers/format';

const AddPost = () => {

    const navigate = useNavigate()

    const authContext = useContext(AuthContext)

    const [title, setTitle] = useState('');
    const [titleHelper, setTitleHelper] = useState('');
    const [image, setImage] = useState<any>('');
    const [imageHelper, setImageHelper] = useState('');
    const [content, setContent] = useState('');
    const [contentHelper, setContentHelper] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentAdding, setCurrentAdding] = useState('');
    const [addingValue, setCurrentAddingValue] = useState('');
    const [contentToAdd, setContentToAdd] = useState('');

    const handleSetTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 50) return
        setTitle(e.target.value);
        if (e.target.value.length === 0) {
            setTitleHelper('Campo requerido');
            return
        } else {
            setTitleHelper('');
        }
    }

    const handleSetImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setImageHelper('El archivo no debe exceder los 10MB');
                return;
            }
            if (file.type !== 'image/png') {
                setImageHelper('Solo se permiten archivos PNG');
                return;
            }

            const imageBlob = await file.arrayBuffer();
            const imageBlobString = new Blob([imageBlob], { type: file.type });
            const reader = new FileReader();
            reader.readAsDataURL(imageBlobString);
            reader.onloadend = async () => {
                const base64data = reader.result;
                setImage(base64data);
                setImageHelper('');
            }
        }
    }

    const handleSetContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length > 4000) return
        setContent(e.target.value);
        setContentHelper('');
        if (e.target.value.length === 0) {
            setContentHelper('Campo requerido');
            return
        }
    }

    const getBlobImageURL = () => {
        try {
            const base64String = image.split(',')[1]; // Remove the data URL prefix if present
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

    const handleSubmit = async () => {
        if (title.length === 0) {
            setTitleHelper('Campo requerido');
            return
        }
        if (image === '') {
            setImageHelper('Debes seleccionar una imagen');
            return
        }
        if (content.length === 0) {
            setContentHelper('Campo requerido');
            return
        }
        const data = {
            content: content,
            title: title,
            image: image,
        };
        if (titleHelper === '' && imageHelper === '' && contentHelper === '') {
            console.log('Data:', data);
        }
        const response = await addPost(data);
        if (response.status === 200) {
            succesAlert('Publicación añadida correctamente!', 'Gracias por tu publicación', () => navigate('/admin'));
        } else {
            errorAlert('No se pudo añadir la publicación', 'Error');
        }
    }

    const setModal = (modalCase: string) => {
        setShowModal(true);
        setCurrentAdding(modalCase);
    }

    const closeModal = () => {
        setShowModal(false);
        setCurrentAdding('');
        setCurrentAddingValue('')
        setContentToAdd('');
    }

    const confirmAdd = () => {
        setContent(content + contentToAdd);
        closeModal();
    }

    const addTitleSubtitle = (e: React.ChangeEvent<HTMLInputElement>, type: 'title' | 'subtitle') => {
        if (e.target.value.length > 100) return
        setCurrentAddingValue(e.target.value);
        const types = {
            title: `<p class="text-xl mb-2">${e.target.value}</p>`,
            subtitle: `<p class="text-lg font-light mb-2 text-primary">${e.target.value}</p>
`
        }
        setContentToAdd(types[type] || '');
    }

    const addText = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 1000) return
        setCurrentAddingValue(e.target.value);
        setContentToAdd(`<p class="text-md font-light mb-2">${e.target.value}</p>`);
    }

    const addList = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 1000) return
        if (e.target.value.split('')[0] === '') return
        const options = e.target.value.split('|');
        let list = `<ul class="list-disc list-inside mb-4">`;
        options.forEach((option, index) => {
            list += `<li>${option}</li>`;
        });
        list += '</ul>';
        console.log('Options:', list);
        setCurrentAddingValue(e.target.value);
        setContentToAdd(list);
    }

    const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 100) return
        setCurrentAddingValue(e.target.value);
        setContentToAdd(`<div class="flex justify-center w-full"><img src="${e.target.value}" class="max-w-72"/></div>`);
    }

    return (
        <div className='container'>
            <Header />
            <div className="background-login-register p-8 grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1">
                <div className="col-start-1 row-start-1">
                    <div className="form m-4">
                        <p className='title'>Añadir nueva publicación</p>
                        <div className='input-container'>
                            <label className='input-label' htmlFor="title">Título</label>
                            <input placeholder='Máximo 50 caracteres' className='input-form' aria-labelledby='title-messages' type="text" name="title" id="title" onChange={handleSetTitle} value={title} />
                            <span className='input-helper' id="title-messages">{titleHelper}</span>
                        </div>
                        <div className="input-container">
                            <label className='input-label' htmlFor="image">Imagen</label>
                            <input aria-labelledby='file-messages' className='input-form' type="file" id="image" name="image" onChange={handleSetImage} />
                            <span className='input-helper' id="file-messages">{imageHelper}</span>
                        </div>
                        <div className='input-container'>
                            <label className='input-label' htmlFor="content">Contenido</label>
                            <textarea className="input-area" onChange={handleSetContent} value={content} id="content" name="content" />
                            <div className="input-actions">
                                <button onClick={() => setModal('title')} className="input-action rounded-bl-2xl">Título</button>
                                <button onClick={() => setModal('subtitle')} className="input-action">Subtítulo</button>
                                <button onClick={() => setModal('text')} className="input-action">Texto</button>
                                <button onClick={() => setModal('list')} className="input-action">Lista</button>
                                <button onClick={() => setModal('image')} className="input-action rounded-br-2xl">Imagen</button>
                            </div>
                            <span className='input-helper' id="content-messages">{contentHelper}</span>
                        </div>
                        <button onClick={handleSubmit} className='btn-primary'>Añadir Publicación</button>
                    </div>
                </div>
                <div className="md:col-start-2 col-start-1 row-start-2 md:row-start-1 p-4">
                    <div className="w-full bg-white rounded-lg shadow-md p-4">
                        <p className='title mb-4'>{title}</p>
                        <p className='normal-font'>Autor: {authContext?.userName}</p>
                        <p className='normal-font mb-4'>{formatDate(new Date().toISOString())}</p>
                        <div className="w-full flex justify-center rounded-md shadow-inner">
                            <img className='rounded-md max-w-sm w-full' src={getBlobImageURL()} alt="Preview" />
                        </div>
                        <div className='mt-4' dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                </div>

            </div>
            {showModal && (<>
                <div className="modal fixed top-0 left-0 z-10 w-full h-full bg-black opacity-50 flex items-center justify-center">

                </div>
                <div className="modal fixed top-1/4 left-1/4 z-10 w-1/2 p-8 bg-white rounded-lg shadow-md">
                    {currentAdding === 'title' &&
                        <>
                            <p className="title mb-2">Agregar título</p>
                            <div className="input-container mb-4">
                                <label className='input-label' htmlFor="title">Título</label>
                                <input placeholder='Máximo 50 caracteres' className='input-form' aria-labelledby='title-messages' type="text" name="title" id="title" onChange={(e) => addTitleSubtitle(e, 'title')} value={addingValue} />
                            </div>
                        </>
                    }
                    {currentAdding === 'subtitle' &&
                        <>
                            <p className="title mb-2">Agregar subtítulo</p>
                            <div className="input-container mb-4">
                                <label className='input-label' htmlFor="title">Subtítulo</label>
                                <input placeholder='Máximo 50 caracteres' className='input-form' aria-labelledby='title-messages' type="text" name="title" id="title" onChange={(e) => addTitleSubtitle(e, 'subtitle')} value={addingValue} />
                            </div>
                        </>
                    }
                    {currentAdding === 'text' &&
                        <>
                            <p className="title mb-2">Agregar texto</p>
                            <div className="input-container mb-4">
                                <label className='input-label' htmlFor="title">Texto</label>
                                <input placeholder='Máximo 50 caracteres' className='input-form' aria-labelledby='title-messages' type="text" name="title" id="title" onChange={addText} value={addingValue} />
                            </div>
                        </>
                    }
                    {currentAdding === 'list' &&
                        <>
                            <p className="title mb-2">Agregar elementos, separados por |</p>
                            <div className="input-container mb-4">
                                <label className='input-label' htmlFor="title">Elementos</label>
                                <input placeholder='Máximo 50 caracteres' className='input-form' aria-labelledby='title-messages' type="text" name="title" id="title" onChange={addList} value={addingValue} />
                            </div>
                        </>
                    }
                    {currentAdding === 'image' &&
                        <>
                            <p className="title mb-2">URL de la imagen</p>
                            <div className="input-container mb-4">
                                <label className='input-label' htmlFor="title">URL</label>
                                <input placeholder='Máximo 50 caracteres' className='input-form' aria-labelledby='title-messages' type="text" name="title" id="title" onChange={addImage} value={addingValue} />
                            </div>
                        </>
                    }
                    <div className="modal-footer">
                        <button className="btn-primary" onClick={confirmAdd}>Agregar</button>
                        <button className="btn-secondary mr-2" onClick={closeModal}>Cancelar</button>
                    </div>
                </div>
            </>
            )}
        </div>
    )
}

export default AddPost