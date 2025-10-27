import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [todoData, setTodoData] = useState({
    todo: null,
    loading: false,
    editMode: false,
    showDeleteModal: false,
  });

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    file: null,
  });

  const fetchTodo = async () => {
    setTodoData((prev) => ({ ...prev, loading: true }));
    try {
      const res = await axios.get(`http://localhost:8080/todo/${id}`);
      const data = res.data.data;
      setTodoData((prev) => ({ ...prev, todo: data }));
      setForm({
        title: data.title,
        description: data.description || '',
        status: data.status,
        file: null,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setTodoData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchTodo();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/todo/${id}`);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setTodoData((prev) => ({ ...prev, showDeleteModal: false }));
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('status', form.status);
      if (form.file) formData.append('file', form.file);

      await axios.patch(`http://localhost:8080/todo/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setTodoData((prev) => ({ ...prev, editMode: false }));
      fetchTodo();
    } catch (err) {
      console.error(err);
    }
  };

  const { todo, loading, editMode, showDeleteModal } = todoData;
  if (loading || !todo) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  const isImage = todo.file?.mimeType?.startsWith('image/');

  return (
    <div className="min-h-screen p-6 bg-linear-to-r from-indigo-100 via-purple-100 to-pink-100 flex justify-center items-start pt-20">
      <div className="w-full max-w-xl p-6 bg-white/40 backdrop-blur-md rounded-md shadow-lg flex flex-col gap-4">
        <div className="flex justify-between items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white/50 backdrop-blur-sm rounded-md hover:bg-white/70 transition"
          >
            ← Back
          </button>
          <button
            onClick={() => setTodoData((prev) => ({ ...prev, showDeleteModal: true }))}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>

        {editMode ? (
          <>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-md bg-white/50 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-md bg-white/50 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 rounded-md bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-2"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {todo.file && (
              <div className="mb-2">
                {isImage ? (
                  <img src={todo.file.url} alt={todo.file.originalName} className="max-w-full rounded-md shadow mb-2" />
                ) : (
                  <a
                    href={todo.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline mb-2 block"
                  >
                    Download {todo.file.originalName}
                  </a>
                )}
              </div>
            )}

            <input
              type="file"
              onChange={(e) => setForm((prev) => ({ ...prev, file: e.target.files[0] }))}
              className="w-full mb-2"
            />

            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                Save
              </button>
              <button
                onClick={() => setTodoData((prev) => ({ ...prev, editMode: false }))}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-indigo-700">{todo.title}</h1>
            <p className="text-gray-700 mb-4">{todo.description || 'No description provided'}</p>

            {todo.file && (
              <div className="mb-4">
                {isImage ? (
                  <img src={todo.file.url} alt={todo.file.originalName} className="max-w-full rounded-md shadow" />
                ) : (
                  <a
                    href={todo.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline"
                  >
                    Download {todo.file.originalName}
                  </a>
                )}
              </div>
            )}

            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <span>Status: {todo.status}</span>
              <span className="text-gray-500">{new Date(todo.createdAt).toLocaleString()}</span>
            </div>

            <button
              onClick={() => setTodoData((prev) => ({ ...prev, editMode: true }))}
              className="px-4 py-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md shadow-lg hover:scale-105 transition transform"
            >
              Edit
            </button>
          </>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-md p-6 max-w-sm w-full flex flex-col gap-4 shadow-lg">
            <h2 className="text-xl font-bold text-red-600">Confirm Delete</h2>
            <p>Are you sure you want to delete this todo?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setTodoData((prev) => ({ ...prev, showDeleteModal: false }))}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
