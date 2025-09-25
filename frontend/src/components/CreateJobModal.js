import React, { useState, useRef, useEffect } from "react";
import { US_CITIES, COMPANY_SIZES, EXPERIENCE_LEVELS } from "../constants";
import "../styles/components/LoginModal.css";
import { useAuth } from "../context/AuthContext";

export default function CreateJobModal({ open, onClose, onCreated }) {
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

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

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

  const resetForm = () => {
    setTitle("");
    setCompany("");
    setDescription("");
    setApplicationUrl("");
    setLocation("");
    setMinSalary("");
    setMaxSalary("");
    setCompanySize("");
    setExperienceLevel("");
    setError("");
  };

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const companySizeEnum = companySize || null;
      const experienceLevelEnum = experienceLevel ? experienceLevel.toLowerCase().replace(/[^a-z]/g, '_') : null;

      const response = await makeAuthenticatedRequest("/jobs", {
        method: "POST",
        body: JSON.stringify({
          title,
          company,
          description,
          application_url: applicationUrl,
          location: location || null,
          salary_range: getSalaryRange() || null,
          company_size: companySizeEnum,
          experience_level: experienceLevelEnum,
          status: isDraft ? "draft" : "active",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create job");
      }

      const createdJob = await response.json();
      resetForm();

      if (onCreated) {
        onCreated(createdJob);
      }
    } catch (err) {
      setError(err.message || "Failed to create job");
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
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal large" onClick={handleModalClick}>
        <div className="modal-header">
          <h3 style={{ color: "#FF4004" }}>Create Job Posting</h3>
          <button className="close-x" onClick={onClose}>×</button>
        </div>

        {error && <div className="alert error-alert">{error}</div>}

        <form className="form" onSubmit={(e) => handleSubmit(e, false)}>
          <div className="form-row">
            <label className="field">
              <span className="label">Job Title *</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </label>

            <label className="field">
              <span className="label">Company *</span>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Corp"
                required
              />
            </label>
          </div>

          <label className="field">
            <span className="label">Job Description *</span>
            <textarea
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting..."
              required
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
              required
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
              type="button"
              className="btn btn-secondary"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save as Draft"}
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Publish Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
