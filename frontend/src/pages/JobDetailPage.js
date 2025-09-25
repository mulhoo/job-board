import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/pages/JobDetailPage.css";

import { IconButton, Tooltip } from '@mui/material';
import { Share, Check } from '@mui/icons-material';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:8000/jobs/${id}`);

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Job not found");
          } else if (res.status >= 500) {
            throw new Error("Server error. Please try again later.");
          } else {
            throw new Error("Failed to load job");
          }
        }

        const data = await res.json();
        setJob(data);
      } catch (e) {
        setError(e.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  const handleApply = () => {
    if (job?.application_url) {
      window.open(job.application_url, "_blank");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const formatDescription = (description) => {
    if (!description) return "";

    return description.split('\n\n').map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ));
  };

  const formatExperienceLevel = (level) => {
    if (!level) return "";
    return level.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatCompanySize = (size) => {
    if (!size) return "";
    return `${size} employees`;
  };

  if (loading) {
    return (
      <div className="jobdetail loading">
        <div className="spinner" />
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="jobdetail error">
        <h2>Oops!</h2>
        <p>{error || "Job not found."}</p>
        <div className="error-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate(-1)}
            aria-label="Go back to previous page"
          >
            ← Go Back
          </button>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
            aria-label="Retry loading job"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const {
    title,
    company,
    location,
    salary_range,
    description,
    application_url,
    company_size,
    experience_level
  } = job;

  return (
    <div className="jobdetail">
      <header className="jobdetail-header">
        <button
          className="btn btn-outline back"
          onClick={() => navigate(-1)}
          aria-label="Go back to previous page"
        >
          ←
        </button>

        <div className="copy-link-icon">
          <Tooltip title={copySuccess ? "Link copied!" : "Copy job link"}>
            <IconButton
              onClick={handleCopyLink}
              className={copySuccess ? "copy-success" : ""}
              aria-label="Copy job link to clipboard"
              size="small"
            >
              {copySuccess ? <Check fontSize="small" /> : <Share fontSize="small" />}
            </IconButton>
          </Tooltip>
        </div>

        <h1 className="jobdetail-title">{title}</h1>

        <div className="meta-row">
          {company && (
            <span className="chip company" aria-label={`Company: ${company}`}>
              {company}
            </span>
          )}
          {location && (
            <span className="chip" aria-label={`Location: ${location}`}>
              {location}
            </span>
          )}
          {salary_range && (
            <span className="chip money" aria-label={`Salary: ${salary_range}`}>
              {salary_range}
            </span>
          )}
          {experience_level && (
            <span className="chip experience" aria-label={`Experience: ${formatExperienceLevel(experience_level)}`}>
              {formatExperienceLevel(experience_level)}
            </span>
          )}
          {company_size && (
            <span className="chip size" aria-label={`Company size: ${formatCompanySize(company_size)}`}>
              {formatCompanySize(company_size)}
            </span>
          )}
        </div>

        <div className="actions-row single-action">
          <button
            className="btn btn-success"
            disabled={!application_url}
            onClick={handleApply}
            aria-label={application_url ? "Apply for this job" : "Application link not available"}
          >
            {application_url ? "Apply Now" : "Application Unavailable"}
          </button>
        </div>
      </header>

      <section className="jobdetail-body">
        <h2 className="section-title">About the role</h2>
        <div className="job-desc" role="article">
          {formatDescription(description)}
        </div>

        {!description && (
          <p className="no-description">No job description available.</p>
        )}
      </section>
    </div>
  );
}