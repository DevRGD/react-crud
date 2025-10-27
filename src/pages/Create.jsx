import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Create() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (formData.file) data.append('file', formData.file);

    try {
      await axios.post('http://localhost:8080/todo', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/');
    } catch (err) {
      console.error('Failed to create todo', err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-linear-to-r from-indigo-100 via-purple-100 to-pink-100 flex justify-center items-start pt-20">
      <div className="w-full max-w-xl p-6 bg-white/40 backdrop-blur-md rounded-md shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-md hover:bg-white/70 transition"
        >
          ← Back
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">Create New Todo</h1>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full px-4 py-3 rounded-md bg-white/50 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-4 py-3 rounded-md bg-white/50 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />

          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-white/50 backdrop-blur-sm border border-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />

          <button
            type="submit"
            className="w-full py-3 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-md shadow-lg hover:scale-105 transition transform"
          >
            Create Todo
          </button>
        </form>
      </div>
    </div>
  );
}
