import { LoginBody, LoginResponse, Post, PostsResponse, commentCreateResponse } from '../interfaces/api';

const URLAPI = 'https://blog-back-rho.vercel.app';

const headersToken = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
}

const headers = {
    'Content-Type': 'application/json'
}

export const login = async (body: LoginBody): Promise<LoginResponse | void> => {
    try {
        const response = await fetch(URLAPI + '/users/login', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
        const status: number = response.status;
        const data: LoginResponse = await response.json();
        return { ...data, status };
    } catch (error) {
        console.log(error);
    }
}

export const register = async (body: LoginBody): Promise<LoginResponse | void> => {
    try {
        const response = await fetch(URLAPI + '/users/create', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
        const status: number = response.status;
        const data: LoginResponse = await response.json();
        return { ...data, status };
    } catch (error) {
        console.log(error);
    }
}

export const verifyToken = async (token: string): Promise<boolean> => {
    try {
        const response = await fetch(URLAPI + '/users/validateToken', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        const status: string = data.message;
        return status === "OK";
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const logout = async (): Promise<boolean> => {
    try {
        const response = await fetch(URLAPI + '/users/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const status: number = response.status;
        return status === 200;
    } catch (error) {
        return false
    }
}

export const fetchPosts = async (): Promise<PostsResponse>  => {
    try {
        const response = await fetch(URLAPI + '/posts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const status: number = response.status;
        const data: PostsResponse = await response.json();
        return { ...data, status };
    } catch (error) {
        console.log(error);
        return { posts: [{} as Post], status: 500, message: 'Error fetching posts' };
    }
}

export const fetchPost = async (id: string): Promise<Post | undefined> => {
    try {
        const response = await fetch(URLAPI + `/posts/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const status: number = response.status;
        if (status === 200) {
            const {post} = await response.json();
            const data: Post = post
            return data;
        } else {
            return undefined;
        }
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export const getPermissions = async (token:string) => {
    try {
        const response = await fetch(URLAPI + `/users/permissions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    } catch (error) {
        
    }
}

export const fetchUserDataFromToken = async (token:string) => {
    try {
        const response = await fetch(URLAPI + `/users/data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    } catch (error) {
        
    }
}

export const postComment = async (body: {}): Promise<commentCreateResponse> => {
    try {
        const response = await fetch(URLAPI + '/comments/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(body)
        });
        console.log(headersToken)
        const json = await response.json();
        return {status: response.status, message: json.message};
    } catch (error) {
        console.log(error);
        return {status: 500, message: error as string};
    }
}

export const approveComment = async (commentId: string): Promise<commentCreateResponse> => {
    try {
        const response = await fetch(URLAPI + `/comments/approve/${commentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const json = await response.json();
        return {status: response.status, message: json.message};
    } catch (error) {
        console.log(error);
        return {status: 500, message: error as string};
    }
}

export const discardComment = async (commentId: string): Promise<commentCreateResponse> => {
    try {
        const response = await fetch(URLAPI + `/comments/delete/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const json = await response.json();
        return {status: response.status, message: json.message};
    } catch (error) {
        console.log(error);
        return {status: 500, message: error as string};
    }
}

export const addPost = async (body: {}): Promise<commentCreateResponse> => {
    try {
        const response = await fetch(URLAPI + '/posts/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(body)
        });
        const json = await response.json();
        return {status: response.status, message: json.message};
    } catch (error) {
        console.log(error);
        return {status: 500, message: error as string};
    }
}

export const deletePost = async (postId: string): Promise<commentCreateResponse> => {
    try {
        const response = await fetch(URLAPI + `/posts/delete/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const json = await response.json();
        return {status: response.status, message: json.message};
    } catch (error) {
        console.log(error);
        return {status: 500, message: error as string};
    }
}

export const editPost = async (postId: string, body: {}): Promise<commentCreateResponse> => {
    try {
        const response = await fetch(URLAPI + `/posts/update/${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(body)
        });
        const json = await response.json();
        return {status: response.status, message: json.message};
    } catch (error) {
        console.log(error);
        return {status: 500, message: error as string};
    }
}