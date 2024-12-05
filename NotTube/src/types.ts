export interface Video {
    _id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    url: string;
    userId: {
        _id: string,
        username: string,
    };
}
  
export interface Comment {
    _id: string;
    content: string;
    userDisplayName: string;
    likesCount: number;
    userId: string;
    isEditing: boolean;
}