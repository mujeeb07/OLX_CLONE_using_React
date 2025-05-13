
import React from 'react';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';

function UserProfile({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      onClose(); 
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <div
      id="user-profile-modal"
      tabIndex="-1"
      aria-hidden={!isOpen}
      className={`${
        isOpen ? 'block' : 'hidden'
      } fixed top-24 right-0 z-50 w-full max-h-full overflow-y-auto overflow-x-hidden bg-transparent`}
    >
      <div className="relative p-4 w-full max-w-sm ml-auto mr-4">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow border border-gray-200">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t">
            <h3 className="text-xl font-semibold text-black">User Profile</h3>
            <button
              type="button"
              className="text-black bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <div className="p-4 space-y-4">
            {user ? (
              <>
                <p className="text-base text-black">
                  <span className="font-semibold">Username:</span> {user.displayName || 'Anonymous'}
                </p>
                <p className="text-base text-black">
                  <span className="font-semibold">Email:</span> {user.email || 'No email provided'}
                </p>

                {/* Modal footer */}
                <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b">
                    <button
                    type="button"
                    onClick={handleLogout}
                    className="py-2 px-4 text-sm font-medium text-red-800 bg-transparent border border-red-800 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-200"
                    >
                    Logout
                    </button>
                </div>
              </>
              
            ) : (
              <p className="text-base text-black">Not logged in</p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default UserProfile;