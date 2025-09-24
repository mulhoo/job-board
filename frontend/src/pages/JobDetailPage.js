import React from 'react';
import { useParams } from 'react-router-dom';

const JobDetailPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Job Details</h1>
      <p>Job ID: {id}</p>
      <p>Job details and apply button will go here</p>
    </div>
  );
};

export default JobDetailPage;