import axios from 'axios';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    order: 'desc',
    status: '',
  });

  const navigate = useNavigate();

  const fetchTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:8080/todo/list', { params });
      setTodos(res.data.data);
      setMeta({
        page: res.data.page,
        totalPages: res.data.totalPages,
        total: res.data.total || 0,
      });
    } catch (err) {
      setError('Failed to fetch todos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [params]);

  const handlePageChange = (newPage) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleSort = (field) => {
    setParams((prev) => ({
      ...prev,
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  };

  const handleStatusFilter = (status) => {
    setParams((prev) => ({ ...prev, status, page: 1 }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const daySuffix = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };
    return format(date, `do'${daySuffix(day)}' MMM, yyyy hh:mma`).toLowerCase();
  };

  return (
    <div className="min-h-screen p-6 bg-linear-to-r from-indigo-100 via-purple-100 to-pink-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-indigo-700">My Todos</h1>
        <button
          onClick={() => navigate('/create')}
          className="px-6 py-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-md shadow-lg hover:scale-105 transition transform"
        >
          + New Todo
        </button>
      </div>

      {/* Todos Table */}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : todos.length === 0 ? (
        <p className="text-center text-gray-600">No todos found.</p>
      ) : (
        <div className="overflow-x-auto rounded-md shadow-lg bg-white/50 backdrop-blur-sm p-2">
          <table className="min-w-full">
            <thead>
              <tr>
                <th
                  className="px-6 py-3 text-left text-gray-700 font-medium cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  Title {params.sortBy === 'title' ? (params.order === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">
                  Status
                  <select
                    value={params.status}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className="ml-2 px-2 py-1 rounded-md bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </th>
                <th
                  className="px-6 py-3 text-left text-gray-700 font-medium cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  Created At {params.sortBy === 'createdAt' ? (params.order === 'asc' ? '↑' : '↓') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr
                  key={todo._id}
                  className="hover:bg-white/30 cursor-pointer transition rounded-md"
                  onClick={() => navigate(`/details/${todo._id}`)}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{todo.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-md text-sm font-semibold ${
                        todo.status === 'pending'
                          ? 'bg-yellow-200 text-yellow-800'
                          : todo.status === 'in-progress'
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-green-200 text-green-800'
                      }`}
                    >
                      {todo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{formatDate(todo.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <div className="text-gray-700">
          Showing {(meta.page - 1) * params.limit + 1}-{Math.min(meta.page * params.limit, meta.total)} of {meta.total}{' '}
          todos
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handlePageChange(Math.max(meta.page - 1, 1))}
            disabled={meta.page === 1}
            className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-md hover:bg-white/80 transition disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(Math.min(meta.page + 1, meta.totalPages))}
            disabled={meta.page === meta.totalPages}
            className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-md hover:bg-white/80 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
