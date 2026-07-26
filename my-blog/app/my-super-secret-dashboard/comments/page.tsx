// ─── COMMENT MODERATION PAGE ─────────────────────────────────────
// Admin-only page for reviewing and managing pending comments.
// Accessible only to users with the admin email.
// Displays all comments that are pending approval (approved: false).
// Admin can:
//   - Approve a comment → makes it visible on the blog
//   - Delete a comment → permanently removes it

import { getPendingComments, approveComment, deleteComment } from '@/lib/actions/comments';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ModerationPage() {
  const session = await auth();

  // ─── AUTHENTICATION ──────────────────────────────────────────────
  // Verifies that the user is logged in and is the admin.
  // If not, redirects to the homepage.
  // This prevents unauthorized access to the moderation page.
  if (!session || session.user?.email !== 'kumeramerera10@gmail.com') {
    redirect('/');
  }

  // ─── FETCH PENDING COMMENTS ─────────────────────────────────────
  // Retrieves all comments where approved = false from the database.
  // Includes the author and post information for context.
  // Ordered by creation date (oldest first).
  const pendingComments = await getPendingComments();

  // ─── UI ──────────────────────────────────────────────────────────
  // Displays a list of pending comments with:
  //   - Author name and email
  //   - Post title
  //   - Comment content
  //   - Approve button → sets approved = true
  //   - Delete button → permanently removes the comment
  // Shows a message when no comments are pending.
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Comment Moderation</h1>

        {pendingComments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No pending comments.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingComments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{comment.author?.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">
                      On: {comment.post?.title}
                    </p>
                    <p className="text-gray-700 mt-2">{comment.content}</p>
                  </div>
                  <form
                    action={async () => {
                      'use server';
                      await approveComment(comment.id);
                      redirect('/my-super-secret-dashboard/comments');
                    }}
                  >
                    <button className="btn-primary text-sm py-1 px-4">
                      Approve
                    </button>
                  </form>
                  <form
                    action={async () => {
                      'use server';
                      await deleteComment(comment.id);
                      redirect('/my-super-secret-dashboard/comments');
                    }}
                  >
                    <button className="bg-red-600 text-white text-sm py-1 px-4 rounded-lg hover:bg-red-700 transition">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}