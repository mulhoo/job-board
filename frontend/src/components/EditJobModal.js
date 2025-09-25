import React, { useState, useRef, useEffect } from "react";
import { US_CITIES, COMPANY_SIZES, EXPERIENCE_LEVELS } from "../constants";
import { useAuth } from "../context/AuthContext";
import "../styles/components/CreateJobModal.css";
import ModalPortal from "./ModalPortal";
import toast from 'react-hot-toast';

export default function UpdateJobModal({ open, onClose, job, onUpdated }) {
  const { makeAuthenticatedRequest } = useAuth();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const locationInputRef = useRef(null);

  useEffect(() => {
    if (job && open) {
      setTitle(job.title || "");
      setCompany(job.company || "");
      setDescription(job.description || "");
      setApplicationUrl(job.application_url || "");
      setLocation(job.location || "");

      if (job.salary_range) {
        const salaryMatch = job.salary_range.match(/\$?([\d,]+)/g);
        if (salaryMatch && salaryMatch.length >= 2) {
          setMinSalary(salaryMatch[0].replace(/[$]/g, ''));
          setMaxSalary(salaryMatch[1].replace(/[$]/g, ''));
        } else if (salaryMatch && salaryMatch.length === 1) {
          setMinSalary(salaryMatch[0].replace(/[$]/g, ''));
          setMaxSalary("");
        }
      } else {
        setMinSalary("");
        setMaxSalary("");
      }

      setCompanySize(job.company_size || "");
      setExperienceLevel(job.experience_level ?
        job.experience_level.split('_').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ').replace('Level', 'Level') : "");

      setError("");
    }
  }, [job, open]);

  useEffect(() => {
    if (location && location.length >= 2) {
      const filtered = US_CITIES.filter(city =>
        city.toLowerCase().includes(location.toLowerCase())
      ).slice(0, 8);
      setFilteredCities(filtered);
      setShowLocationSuggestions(filtered.length > 0 && !filtered.includes(location));
    } else {
      setFilteredCities([]);
      setShowLocationSuggestions(false);
    }
  }, [location]);

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setShowLocationSuggestions(false);
    setFilteredCities([]);
  };

  const formatSalaryInput = (value) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    return parseInt(digits).toLocaleString();
  };

  const handleMinSalaryChange = (e) => {
    const formatted = formatSalaryInput(e.target.value);
    setMinSalary(formatted);
  };

  const handleMaxSalaryChange = (e) => {
    const formatted = formatSalaryInput(e.target.value);
    setMaxSalary(formatted);
  };

  const getSalaryRange = () => {
    if (!minSalary && !maxSalary) return "";
    const min = minSalary ? `$${minSalary}` : "";
    const max = maxSalary ? `$${maxSalary}` : "";
    if (min && max) return `${min} - ${max}`;
    if (min) return `${min}+`;
    if (max) return `Up to ${max}`;
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateJob(false);
  };

  const handlePublish = async () => {
    const requiredFields = [
      { value: title, name: 'Job Title' },
      { value: company, name: 'Company' },
      { value: description, name: 'Job Description' },
      { value: applicationUrl, name: 'Application URL' }
    ];

    const missingFields = requiredFields.filter(field => !field.value.trim());

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(field => field.name).join(', ');
      setError(`Please fill in the following required fields: ${fieldNames}`);
      return;
    }

    try {
      new URL(applicationUrl);
    } catch {
      setError('Please enter a valid application URL');
      return;
    }

    await updateJob(true);
  };

  const updateJob = async (publish = false) => {
    setError("");
    setLoading(true);

    try {
      const companySizeEnum = companySize || null;
      const experienceLevelEnum = experienceLevel ?
        experienceLevel.toLowerCase().replace(/[^a-z]/g, '_') : null;

      const updateData = {
        title,
        company,
        description,
        application_url: applicationUrl,
        location: location || null,
        salary_range: getSalaryRange() || null,
        company_size: companySizeEnum,
        experience_level: experienceLevelEnum,
      };

      if (publish && job.status === 'draft') {
        updateData.status = 'active';
      }

      const response = await makeAuthenticatedRequest(`/jobs/${job.id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update job");
      }

      const updatedJob = await response.json();

      if (publish && job.status === 'draft') {
        toast.success('Job published successfully!');
      }

      if (onUpdated) {
        onUpdated(updatedJob);
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err.message || "Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (!open) return null;

  return (
    <ModalPortal>
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal large" onClick={handleModalClick}>
          <div className="modal-header">
            <h3 style={{ color: "#FF4004" }}>Update Job Posting</h3>
            <button className="close-x" onClick={onClose}>×</button>
          </div>

          {error && <div className="alert error-alert">{error}</div>}

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="field">
                <span className="label">Job Title *</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  required={job?.status !== 'draft'}
                />
              </label>

              <label className="field">
                <span className="label">Company *</span>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  required={job?.status !== 'draft'}
                />
              </label>
            </div>

            <label className="field">
              <span className="label">Job Description *</span>
              <textarea
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the role..."
                required={job?.status !== 'draft'}
                className="description-textarea"
              />
            </label>

            <label className="field">
              <span className="label">Application URL *</span>
              <input
                type="url"
                value={applicationUrl}
                onChange={(e) => setApplicationUrl(e.target.value)}
                placeholder="https://company.com/careers/apply"
                required={job?.status !== 'draft'}
              />
            </label>

            <div className="form-row">
              <label className="field location-field">
                <span className="label">Location</span>
                <div className="location-input-container">
                  <input
                    ref={locationInputRef}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onFocus={() => setShowLocationSuggestions(filteredCities.length > 0)}
                    placeholder="Start typing city name..."
                  />
                  {showLocationSuggestions && (
                    <div className="location-suggestions">
                      {filteredCities.map((city, index) => (
                        <div
                          key={index}
                          className="location-suggestion"
                          onClick={() => handleLocationSelect(city)}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </label>

              <div className="field">
                <span className="label">Salary Range</span>
                <div className="salary-range">
                  <div className="salary-input">
                    <span className="salary-prefix">$</span>
                    <input
                      value={minSalary}
                      onChange={handleMinSalaryChange}
                      placeholder="75,000"
                      className="salary-field"
                    />
                  </div>
                  <span className="salary-separator">to</span>
                  <div className="salary-input">
                    <span className="salary-prefix">$</span>
                    <input
                      value={maxSalary}
                      onChange={handleMaxSalaryChange}
                      placeholder="95,000"
                      className="salary-field"
                    />
                  </div>
                </div>
                {getSalaryRange() && (
                  <div className="salary-preview">Preview: {getSalaryRange()}</div>
                )}
              </div>
            </div>

            <div className="form-row">
              <label className="field">
                <span className="label">Company Size</span>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="select-field"
                >
                  <option value="">Select company size...</option>
                  {COMPANY_SIZES.map((size, index) => (
                    <option key={index} value={size}>{size} employees</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span className="label">Experience Level</span>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="select-field"
                >
                  <option value="">Select experience level...</option>
                  {EXPERIENCE_LEVELS.map((level, index) => (
                    <option key={index} value={level}>{level}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                className="btn btn-secondary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Job"}
              </button>

              {job?.status === 'draft' && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePublish}
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish Job"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}