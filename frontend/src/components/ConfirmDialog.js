import React from "react";
import "../styles/components/LoginModal.css";
import ModalPortal from "./ModalPortal";

export default function ConfirmDialog({
  open, title="Confirm", message="Are you sure?",
  confirmText="Yes", cancelText="Cancel",
  onConfirm, onCancel, disabled=false
}) {
  if (!open) return null;
  const stop = (e) => e.stopPropagation();

  return (
    <ModalPortal>
      <div className="modal-backdrop" onClick={onCancel}>
        <div className="modal nice" onClick={stop} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="modal-header">
            <h3 id="confirm-title">{title}</h3>
            <button className="close-x" onClick={onCancel} aria-label="Close">×</button>
          </div>
          <div className="form">
            <p>{message}</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={onCancel} disabled={disabled}>{cancelText}</button>
              <button className="btn btn-danger" onClick={onConfirm} disabled={disabled}>{confirmText}</button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
