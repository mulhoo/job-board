import React, { useState } from "react";
import "../styles/components/JobCard.css";
import EditJobModal from "./EditJobModal";
import ConfirmDialog from "./ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../constants";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import ErrorIcon from "@mui/icons-material/Error";
import toast from 'react-hot-toast';

const JobCard = ({ job, onDeleted, onUpdated }) => {
  const { user } = useAuth();
  const isAdmin = !!user?.is_admin;
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    try {
      setBusy(true);
      const token = localStorage.getItem("access_token");

      if (job.status === 'closed') {
        const res = await fetch(`${API_BASE_URL}/jobs/${job.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to delete job");
        toast.success('Job deleted successfully!');
        onDeleted?.(job.id);
      } else {
        const res = await fetch(`${API_BASE_URL}/jobs/${job.id}/status?status=closed`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          }
        });
        if (!res.ok) throw new Error("Failed to close job");

        if (onUpdated) {
          onUpdated({ ...job, status: "closed" });
        }
      }

      setConfirmOpen(false);
    } catch (err) {
      alert(err.message || "Operation failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleUnarchive() {
    try {
      setBusy(true);
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE_URL}/jobs/${job.id}/status?status=draft`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
      });
      if (!res.ok) throw new Error("Failed to unarchive job");
      if (onUpdated) {
        onUpdated({ ...job, status: "draft" });
      }
    } catch (err) {
      alert(err.message || "Unarchive failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="job-card">
      {isAdmin && (
        <div className="job-card-admin-icons">
          {job.status === 'closed' ? (
            <>
              <Tooltip title="Unarchive">
                <IconButton size="small" onClick={handleUnarchive} aria-label="Unarchive job">
                  <RestoreIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => setConfirmOpen(true)} aria-label="Delete job">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              {job.status !== 'draft' && (
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => setEditOpen(true)} aria-label="Edit job">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Close">
                <IconButton
                  size="small"
                  onClick={() => setConfirmOpen(true)}
                  aria-label="Close job"
                >
                  <ArchiveIcon className="archive-icon" fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
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
        {job.status === 'draft' ? (
          <button className="btn btn-outline" onClick={() => setEditOpen(true)}>
            Edit Draft
          </button>
        ) : job.status === 'closed' ? (
          <div className="closed-job-notice">
            <ErrorIcon style={{ color: '#dc2626', fontSize: '18px', marginRight: '6px' }} />
            <span>This job posting is closed</span>
          </div>
        ) : (
          <>
            <button
              className="btn btn-outline"
              onClick={() => window.location.assign(`/job/${job.id}`)}
            >
              View Details
            </button>
            <button
              className="btn btn-success"
              disabled={!job.application_url}
              onClick={() => job.application_url && window.open(job.application_url, "_blank")}
            >
              Apply Now
            </button>
          </>
        )}
      </div>

      <EditJobModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        job={job}
        onUpdated={onUpdated}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={job.status === 'closed' ? "Delete Job" : "Close Job"}
        message={job.status === 'closed'
          ? "Are you sure you want to permanently delete this job posting?"
          : "Are you sure you want to close this job posting?"
        }
        confirmText={busy ? (job.status === 'closed' ? "Deleting..." : "Closing...") : (job.status === 'closed' ? "Yes, delete" : "Yes, close")}
        cancelText="No"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        disabled={busy}
      />
    </article>
  );
};

export default JobCard;