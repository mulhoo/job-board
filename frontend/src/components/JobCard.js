import React, { useState } from "react";
import "../styles/components/JobCard.css";
import EditJobModal from "./EditJobModal";
import ConfirmDialog from "./ConfirmDialog";
import { useAuth } from "../context/AuthContext";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";

const JobCard = ({ job, onDeleted }) => {
  const { user } = useAuth();
  const isAdmin = !!user?.is_admin;

  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    try {
      setBusy(true);
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:8000/jobs/${job.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to delete job");
      setConfirmOpen(false);
      onDeleted?.(job.id);
    } catch (err) {
      alert(err.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="job-card">
      {isAdmin && (
        <div className="job-card-admin-icons">
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => setEditOpen(true)} aria-label="Edit job">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton
              size="small"
              onClick={() => setConfirmOpen(true)}
              aria-label="Delete job"
            >
              <ArchiveIcon className="archive-icon" fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      )}

      <div className="job-card-content">
        <h3 className="job-card-title">{job.title}</h3>
        <p className="job-card-company">{job.company}</p>
        {job.location && <p className="job-card-location">📍 {job.location}</p>}
        {job.salary_range && <p className="job-card-salary">💰 {job.salary_range}</p>}
        <p className="job-card-description">{job.description}...</p>
      </div>

      <div className="job-card-actions">
        <button className="btn btn-outline" onClick={() => window.location.assign(`/job/${job.id}`)}>
          View Details
        </button>
        <button
          className="btn btn-success"
          disabled={!job.application_url}
          onClick={() => job.application_url && window.open(job.application_url, "_blank")}
        >
          Apply Now
        </button>
      </div>

      <EditJobModal open={editOpen} onClose={() => setEditOpen(false)} job={job} />
      <ConfirmDialog
        open={confirmOpen}
        title="Close Job"
        message="Are you sure you want to close this job posting?"
        confirmText={busy ? "Closing..." : "Yes, close"}
        cancelText="No"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        disabled={busy}
      />
    </article>
  );
};

export default JobCard;
