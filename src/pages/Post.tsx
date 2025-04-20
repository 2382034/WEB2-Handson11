import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";

// Types
interface ReactionType {
  likes: number;
  dislikes: number;
}

interface PostData {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: ReactionType;
  views: number;
  userId: number;
}

interface PostList {
  posts: PostData[];
}

interface DeletedPost extends PostData {
  isDeleted: boolean;
  deletedOn: string;
}

// API
const fetchPostData = async (token: string) => {
  return await axios.get<PostList>("/post", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const deletePost = async (id: string | undefined) => {
  return await axios.delete<DeletedPost>(`post/${id}`);
};

// Skeleton UI
const PostSkeleton = () => (
  <div className="flex-col flex space-y-2 mt-20 p-3 bg-white rounded-xl ">
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-gray-300 animate-pulse h-11 w-11 rounded-full"></div>
          <div className="bg-gray-300 animate-pulse h-9 w-50 rounded-xl"></div>
        </div>
        <div className="bg-gray-300 animate-pulse h-5.5 w-5.5 rounded-full"></div>
      </div>
      <div className="bg-gray-300 animate-pulse h-6 w-25 rounded-2xl"></div>
      <div className="bg-gray-300 animate-pulse h-0.5 w-full rounded-2xl"></div>
      <div className="bg-gray-300 animate-pulse h-[200px] w-full rounded-2xl"></div>
    </div>
    <div className="flex space-x-1">
      <div className="bg-gray-300 animate-pulse h-6 w-50 rounded-2xl"></div>
    </div>
    <div className="flex justify-between">
      <div className="flex items-center space-x-2">
        <div className="bg-gray-300 animate-pulse h-6 w-23 rounded-2xl"></div>
      </div>
      <div className="flex space-x-3 justify-end">
        <div className="flex items-center space-x-2">
          <div className="bg-gray-300 animate-pulse h-6 w-23 rounded-2xl"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-gray-300 animate-pulse h-6 w-23 rounded-2xl"></div>
        </div>
      </div>
    </div>
  </div>
);

// PostCard Component
const PostCard: React.FC<PostData> = (post) => {
  const navigate = useNavigate();
  const deletePostMutation = useMutation({
    mutationFn: (id: string) => deletePost(id),
  });

  return (
    <div className="flex-col flex space-y-8 mt-20 p-3 bg-white rounded-xl">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-10 bg-gray-700 text-gray-200 rounded-full hover:bg-gray-600 hover:text-gray-100 transition-all hover:p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975..." />
            </svg>
            <p className="font-semibold text-gray-700 hover:underline">Anonymous {post.userId}</p>
          </div>
          <div className="relative group">
            <button>
              <svg className="w-7 text-gray-700 hover:text-gray-500 rounded-full p-1 hover:rotate-45 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9.594 3.94c..." />
              </svg>
            </button>
            <div className="absolute bottom-14 right-0 bg-white rounded-lg shadow-lg w-32 hidden group-focus-within:block">
              <button onClick={() => navigate(`${post.id}/edit`)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Edit
              </button>
              <button
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  if (confirm("Are you sure want to delete this post?")) {
                    deletePostMutation.mutate(post.id.toString());
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <p className="text-lg font-bold text-gray-700">{post.title}</p>
        <hr />
        <p>{post.body}</p>
      </div>
      <div className="flex space-x-1">
        <p className="text-sm font-bold text-gray-700">Tags:</p>
        {post.tags.map((tag, i) => (
          <p key={i} className="text-sm font-semibold text-gray-700 hover:underline">{tag}{i < post.tags.length - 1 ? ',' : ''}</p>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          👁️ <p>{post.views}</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2">👍 <p>{post.reactions.likes}</p></div>
          <div className="flex items-center space-x-2">👎 <p>{post.reactions.dislikes}</p></div>
        </div>
      </div>
    </div>
  );
};

// Main Post Component
const Post = () => {
  const { getToken } = useAuth();
  const token = getToken();
  const { data, isFetching } = useQuery({
    queryKey: ["postList"],
    queryFn: () => fetchPostData(token),
  });
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4">
      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600"
        onClick={() => navigate("./add")}
      >
        ➕
      </button>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Resep Makanan</h2>
          <div className="flex flex-col gap-9 mt-9 h-[800px] overflow-y-scroll bg-gray-800 p-6 rounded-2xl">
            {isFetching
              ? Array.from({ length: 4 }).map((_, i) => <PostSkeleton key={i} />)
              : data?.data.posts.map((post) => <PostCard key={post.id} {...post} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
