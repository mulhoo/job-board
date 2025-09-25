import React, { useState, useEffect, useCallback, useMemo } from "react";
import "../styles/pages/HomePage.css";
import "../styles/components/Button.css";
import JobCard from "../components/JobCard.js";
import CreateJobModal from "../components/CreateJobModal.js";
import { useAuth } from "../context/AuthContext";
import { SALARY_RANGES, EXPERIENCE_LEVELS, COMPANY_SIZES } from "../constants";

import AddIcon from "@mui/icons-material/Add";
import { Fab, Tooltip } from "@mui/material";

const HomePage = () => {
  const { isAdmin, fetchJobs } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // Admin tab state

  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [companySizeFilter, setCompanySizeFilter] = useState("");

  const ITEMS_PER_PAGE = 20;

  const loadJobs = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 0 : page;

      const params = {
        skip: currentPage * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        ...(searchQuery && { search: searchQuery }),
        ...(locationFilter && { location: locationFilter }),
        ...(companySizeFilter && { company_size: companySizeFilter }),
        ...(experienceFilter && { experience_level: experienceFilter.toLowerCase().replace(/[^a-z]/g, '_') }),
        // Add status filter for admin users
        ...(isAdmin() && { status: activeTab })
      };

      const newJobs = await fetchJobs(params);

      if (reset) {
        setJobs(newJobs);
        setPage(1);
      } else {
        setJobs(prev => [...prev, ...newJobs]);
        setPage(prev => prev + 1);
      }

      setHasMore(newJobs.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, locationFilter, companySizeFilter, experienceFilter, fetchJobs, isAdmin, activeTab]);

  useEffect(() => {
    loadJobs(true);
  }, []);

  // Reload jobs when admin tab changes
  useEffect(() => {
    if (isAdmin()) {
      loadJobs(true);
    }
  }, [activeTab]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadJobs(true);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, locationFilter, salaryFilter, experienceFilter, companySizeFilter]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 &&
        hasMore &&
        !loading
      ) {
        loadJobs(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, loadJobs]);

  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    // Filter by admin tab status (only for admin users)
    if (isAdmin()) {
      filtered = filtered.filter(job => job.status === activeTab);
    } else {
      // For non-admin users, only show active jobs
      filtered = filtered.filter(job => job.status === 'active');
    }

    // Apply salary filter if selected
    if (salaryFilter) {
      filtered = filtered.filter(job => {
        if (!job.salary_range) return false;

        const salaryMatch = job.salary_range.match(/\$?([\d,]+)/g);
        if (!salaryMatch) return false;

        const minSalary = parseInt(salaryMatch[0].replace(/[,$]/g, ''));

        switch (salaryFilter) {
          case "Under $50,000":
            return minSalary < 50000;
          case "$50,000 - $75,000":
            return minSalary >= 50000 && minSalary <= 75000;
          case "$75,000 - $100,000":
            return minSalary >= 75000 && minSalary <= 100000;
          case "$100,000 - $150,000":
            return minSalary >= 100000 && minSalary <= 150000;
          case "$150,000 - $200,000":
            return minSalary >= 150000 && minSalary <= 200000;
          case "Over $200,000":
            return minSalary > 200000;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [jobs, salaryFilter, activeTab, isAdmin]);

  const handleJobDeleted = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const handleJobCreated = (job, isDraft) => {
    if (!isDraft || activeTab === 'draft') {
      setJobs(prev => [job, ...prev]);
    }
    setCreateOpen(false);
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      <section className="search-section">
        <h3>Search & Filter Jobs</h3>
        <div className="search-grid">
          <div className="search-field">
            <label htmlFor="search-query">Job Title or Company:</label>
            <input
              id="search-query"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., Software Engineer, Google"
            />
          </div>

          <div className="search-field">
            <label htmlFor="location-filter">Location:</label>
            <input
              id="location-filter"
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="e.g., San Francisco, Remote"
            />
          </div>

          <div className="search-field">
            <button
              className="advanced-filters-toggle"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              aria-label="Toggle advanced filters"
            >
              {showAdvancedFilters ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {showAdvancedFilters && (
          <div className="advanced-filters">
            <div className="advanced-filters-grid">
              <div className="search-field">
                <label htmlFor="salary-filter">Salary Range:</label>
                <select
                  id="salary-filter"
                  value={salaryFilter}
                  onChange={(e) => setSalaryFilter(e.target.value)}
                >
                  <option value="">Any salary</option>
                  {SALARY_RANGES.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              <div className="search-field">
                <label htmlFor="experience-filter">Experience Level:</label>
                <select
                  id="experience-filter"
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                >
                  <option value="">Any level</option>
                  {EXPERIENCE_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="search-field">
                <label htmlFor="company-size-filter">Company Size:</label>
                <select
                  id="company-size-filter"
                  value={companySizeFilter}
                  onChange={(e) => setCompanySizeFilter(e.target.value)}
                >
                  <option value="">Any size</option>
                  {COMPANY_SIZES.map(size => (
                    <option key={size} value={size}>{size} employees</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Admin tabs for job status filtering */}
      {isAdmin() && (
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Jobs
          </button>
          <button
            className={`tab-button ${activeTab === 'draft' ? 'active' : ''}`}
            onClick={() => setActiveTab('draft')}
          >
            Drafts
          </button>
          <button
            className={`tab-button ${activeTab === 'closed' ? 'active' : ''}`}
            onClick={() => setActiveTab('closed')}
          >
            Closed
          </button>
        </div>
      )}

      <div className="job-listings-header">
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <h2 className="job-listings-title">
            {isAdmin() && activeTab === 'draft' ? 'Drafts' :
             isAdmin() && activeTab === 'closed' ? 'Closed Jobs' :
             'Job Listings'}
          </h2>
          {isAdmin() && (
            <Tooltip title="Add Job Listing">
              <Fab
                size="small"
                sx={{
                  width: 20,
                  height: 20,
                  minHeight: "unset",
                  backgroundColor: "#fff",
                  border: "2px solid #FF4004",
                  color: "#FF4004",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#FF4004",
                    color: "#fff",
                    boxShadow: "none"
                  }
                }}
                onClick={() => setCreateOpen(true)}
              >
                <AddIcon sx={{ fontSize: 16 }} />
              </Fab>
            </Tooltip>
          )}
        </div>
        <span className="job-count">({filteredJobs.length} jobs found)</span>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <p>No jobs found matching your search criteria.</p>
          {jobs.length === 0 && (
            <p><em>
              {isAdmin() && activeTab === 'draft' ? 'No draft jobs yet.' :
               isAdmin() && activeTab === 'closed' ? 'No closed jobs yet.' :
               'No jobs yet! Check back soon.'}
            </em></p>
          )}
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onDeleted={handleJobDeleted}
            />
          ))}
        </div>
      )}

      {loading && jobs.length > 0 && (
        <div className="loading-more">
          <div className="loading-spinner small"></div>
          <p>Loading more jobs...</p>
        </div>
      )}

      {!hasMore && jobs.length > 0 && (
        <div className="end-of-results">
          <p>You've reached the end of the results</p>
        </div>
      )}

      <CreateJobModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleJobCreated}
      />
    </div>
  );
};

export default HomePage;