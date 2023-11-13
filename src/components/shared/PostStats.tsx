import { Models } from 'appwrite';

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  console.log(post, userId);

  return <div></div>;
};

export default PostStats;
