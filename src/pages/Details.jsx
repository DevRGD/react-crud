import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchTodo = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/todo/${id}`);
      setTodo(res.data.data);
      setTitle(res.data.data.title);
      setDescription(res.data.data.description);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      setShowDeleteModal(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`http://localhost:8080/todo/${id}`, { title, description });
      setEditMode(false);
      fetchTodo();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await axios.patch(`http://localhost:8080/todo/${id}`, { status });
      fetchTodo();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !todo) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

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
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>

        {editMode ? (
          <>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white/50 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white/50 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
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
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <span>
                Status:
                <select
                  value={todo.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="ml-2 px-3 py-1 rounded-md bg-white/50 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </span>
              <span className="text-gray-500">{new Date(todo.createdAt).toLocaleString()}</span>
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md shadow-lg hover:scale-105 transition transform"
            >
              Edit
            </button>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-md p-6 max-w-sm w-full flex flex-col gap-4 shadow-lg">
            <h2 className="text-xl font-bold text-red-600">Confirm Delete</h2>
            <p>Are you sure you want to delete this todo?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
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
