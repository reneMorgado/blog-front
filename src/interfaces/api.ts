export interface LoginBody {
    email: string;
    password: string;
    username?: string;
}

export interface LoginResponse {
    status: number;
    message: string;
}

export interface PostsResponse {
    posts: [Post];
    status: number;
    message: string;
}

export interface Post {
    content: string;
    createdAt: string;
    creator: string;
    image: string;
    title: string;
    id: string;
    creatorName: string;
    admin: boolean
}

export interface Comment {
    approved: boolean;
    content: string;
    createdAt: string;
    creator: string;
    postId: string;
    id: string;
    creatorName: string;
    postTitle: string;
}

export interface CommentCardProps {
    permissions: string[];
    comment: Comment;
  }

  export interface commentCreateResponse {
    status: number;
    message: string;
  }