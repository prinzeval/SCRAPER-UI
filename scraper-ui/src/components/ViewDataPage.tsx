import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ViewDataPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;

  if (!data) {
    return <p>No data found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">View Data</h1>
      <pre className="p-4 bg-gray-50 border rounded-lg overflow-auto">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to History
      </button>
    </div>
  );
};

export default ViewDataPage;