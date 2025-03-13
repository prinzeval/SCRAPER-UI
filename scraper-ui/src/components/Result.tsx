import React from 'react';

interface ResultProps {
  data: any;
}

const Result: React.FC<ResultProps> = ({ data }) => {
  if (data.error) {
    return <div style={{ color: 'red' }}>Error: {data.error}</div>;
  }

  return (
    <div>
      <h2>Result</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Result;