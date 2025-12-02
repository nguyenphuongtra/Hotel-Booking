import { useParams } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold">Blog Detail #{id}</h1>
      <p className="mt-3 text-gray-600">Nội dung bài viết sẽ hiển thị ở đây...</p>
    </div>
  );
};

export default BlogDetail;
