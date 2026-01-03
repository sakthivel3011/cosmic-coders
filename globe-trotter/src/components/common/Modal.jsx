import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import LoadingSpinner from './LoadingSpinner';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  isLoading = false,
  footer,
  className = ''
}) => {
  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={handleOverlayClick}
      >
        {/* Modal Container */}
        <div 
          className={`${sizeClasses[size]} w-full bg-white rounded-2xl shadow-2xl animate-fade-in ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80 rounded-2xl">
              <LoadingSpinner size="lg" color="primary" text="Loading..." />
            </div>
          )}

          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {title && (
                <h3 
                  id="modal-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {title}
                </h3>
              )}
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  aria-label="Close modal"
                  disabled={isLoading}
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Confirmation Modal Variant
export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false
}) => {
  const variantClasses = {
    default: {
      button: "bg-gt-primary hover:bg-gt-secondary",
      icon: null
    },
    danger: {
      button: "bg-red-600 hover:bg-red-700",
      icon: "🚨"
    },
    warning: {
      button: "bg-yellow-500 hover:bg-yellow-600",
      icon: "⚠️"
    },
    success: {
      button: "bg-green-600 hover:bg-green-700",
      icon: "✅"
    }
  };

  const currentVariant = variantClasses[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      isLoading={isLoading}
      footer={
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white font-medium rounded-lg transition ${currentVariant.button}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      }
    >
      <div className="text-center">
        {currentVariant.icon && (
          <div className="text-3xl mb-4">{currentVariant.icon}</div>
        )}
        <p className="text-gray-600">{message}</p>
      </div>
    </Modal>
  );
};

// Alert Modal Variant
export const AlertModal = ({
  isOpen,
  onClose,
  title = "Alert",
  message,
  type = "info",
  buttonText = "OK"
}) => {
  const typeClasses = {
    info: {
      icon: "ℹ️",
      color: "text-blue-500"
    },
    success: {
      icon: "✅",
      color: "text-green-500"
    },
    warning: {
      icon: "⚠️",
      color: "text-yellow-500"
    },
    error: {
      icon: "❌",
      color: "text-red-500"
    }
  };

  const currentType = typeClasses[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gt-primary text-white font-medium rounded-lg hover:bg-gt-secondary transition"
          >
            {buttonText}
          </button>
        </div>
      }
    >
      <div className="text-center">
        <div className={`text-4xl mb-4 ${currentType.color}`}>
          {currentType.icon}
        </div>
        <p className="text-gray-700">{message}</p>
      </div>
    </Modal>
  );
};

// Form Modal Variant
export const FormModal = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  submitText = "Submit",
  cancelText = "Cancel",
  children,
  isLoading = false,
  size = "md"
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      isLoading={isLoading}
      footer={
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="submit"
            form="modal-form"
            className="px-4 py-2 bg-gt-primary text-white font-medium rounded-lg hover:bg-gt-secondary transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              submitText
            )}
          </button>
        </div>
      }
    >
      <form id="modal-form" onSubmit={onSubmit}>
        {children}
      </form>
    </Modal>
  );
};

export { Modal };
export default Modal;