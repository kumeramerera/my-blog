import { getComments } from '@/lib/actions/comments';
import { auth } from '@/lib/auth';
import Comment from './Comment';

interface CommentListProps {
  postId: number;
}

export default async function CommentList({ postId }: CommentListProps) {
  const comments = await getComments(postId);
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id) : undefined;
  const isLoggedIn = !!session;

  if (comments.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
      </p>
      
      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            postId={postId}
            userId={userId}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
    </div>
  );
}