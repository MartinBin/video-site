export interface Video {
    _id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    url: string;
    userId: string;
}
  
export interface Comment {
    _id: string;
    content: string;
    userDisplayName: string;
    likesCount: number;
    userId: string;
    isEditing: boolean;
}