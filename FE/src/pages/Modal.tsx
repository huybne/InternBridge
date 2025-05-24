// components/Modal.tsx
import React from "react";
import ReactDOM from "react-dom";
import "./modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  width?: string | number; // Giữ prop width như trước
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  width,
}) => {
  if (!isOpen) return null;

  // Hàm xử lý khi click ra ngoài modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" style={{ width: width || "600px" }}>
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close Modal"
        >
          <i className="fa fa-times" aria-hidden="true"></i>
        </button>

        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};

export default Modal;
