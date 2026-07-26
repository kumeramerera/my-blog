'use client';

import { useRouter } from 'next/navigation';

interface DeletePostButtonProps {
  postId: number;
}

export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    const formData = new FormData();
    formData.append('postId', postId.toString());

    try {
      const response = await fetch('/api/posts/delete', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.push('/my-super-secret-dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-600 hover:underline"
    >
      Delete
    </button>
  );
}