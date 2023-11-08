import { Models } from 'appwrite';

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  return <div>{post.caption}</div>;
};

export default PostCard;
