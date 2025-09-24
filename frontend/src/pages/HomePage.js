import React, { useState, useEffect } from 'react';
import '../styles/pages/HomePage.css';
import '../styles/components/Button.css';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:8000/jobs/');
      const data = await response.json();
      setJobs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = locationFilter === '' ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>PropelPeople...into jobs!</h1>
      </header>

      <section className="search-section">
        <h3>🔍 Search Jobs</h3>
        <div className="search-grid">
          <div className="search-field">
            <label htmlFor="search-query">
              Job Title or Company:
            </label>
            <input
              id="search-query"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., Software Engineer, Google"
            />
          </div>

          <div className="search-field">
            <label htmlFor="location-filter">
              Location:
            </label>
            <input
              id="location-filter"
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="e.g., San Francisco, Remote"
            />
          </div>
        </div>
      </section>

      <div className="job-listings-header">
        <h2 className="job-listings-title">Job Listings</h2>
        <span className="job-count">
          ({filteredJobs.length} jobs found)
        </span>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <p>No jobs found matching your search criteria.</p>
          {jobs.length === 0 && (
            <p><em>No jobs in the database yet. An admin needs to add some jobs.</em></p>
          )}
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map(job => (
            <article key={job.id} className="job-card">
              <h3 className="job-card-title">{job.title}</h3>
              <p className="job-card-company">{job.company}</p>
              <p className="job-card-location">📍 {job.location}</p>
              {job.salary_range && (
                <p className="job-card-salary">💰 {job.salary_range}</p>
              )}
              <p className="job-card-description">
                {job.description.substring(0, 150)}...
              </p>
              <div className="job-card-actions">
                <button className="btn btn-outline">
                  View Details
                </button>
                <button className="btn btn-success">
                  Apply Now
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;