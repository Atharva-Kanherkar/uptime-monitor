 // Modal.tsx
import React, { ReactNode } from 'react';
import { IoClose } from 'react-icons/io5'; // You can use any icon library

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-gray-200 rounded-lg p-6 relative w-full max-w-md mx-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-400 transition-colors"
        >
          <IoClose size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
