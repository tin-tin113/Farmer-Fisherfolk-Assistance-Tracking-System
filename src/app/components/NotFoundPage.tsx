import { useNavigate } from 'react-router';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-6xl text-gray-300 mb-4">404</h1>
      <p className="text-gray-500 mb-6">Page not found</p>
      <button onClick={() => navigate('/')} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg text-sm transition-colors">
        Go to Dashboard
      </button>
    </div>
  );
}
