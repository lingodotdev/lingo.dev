import { useState } from 'react';
import Modal from 'react-modal';

function DeleteConfirmationModal({ isOpen, onRequestClose, onConfirm, testTitle }) {
  const [confirmationText, setConfirmationText] = useState('');

  const handleConfirm = () => {
    if (confirmationText === testTitle) {
      onConfirm();
    } else {
      alert('The text you entered does not match the test title.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Delete Confirmation"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
    >
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Deletion</h2>
          <p className="text-gray-600 mb-4">This action cannot be undone. To confirm, please type the full title of the test:</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium text-center">{testTitle}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type the test title to confirm
          </label>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter the test title exactly as shown above"
          />
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={onRequestClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirmationText !== testTitle}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
          >
            Delete Test
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteConfirmationModal;