import React from "react";
import "./ReportModal.scss";

export default function ReportModal({ isOpen, onClose, onSubmit }) {
  const [reason, setReason] = React.useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason) return;
    onSubmit(reason);
    setReason("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Report Post</h3>
        <select value={reason} onChange={(e) => setReason(e.target.value)}>
          <option value="">Select reason</option>
          <option value="Spam">Spam</option>
          <option value="Inappropriate Content">Inappropriate Content</option>
          <option value="Hate Speech">Hate Speech</option>
          <option value="Other">Other</option>
        </select>
        <div className="modal-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
