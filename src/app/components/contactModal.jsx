export const Modal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
  <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        {/* Icon or Emoji for Visual Appeal */}
        <div className="text-center mb-6">
          <span role="img" aria-label="Celebration" className="text-6xl">
            🎉
          </span>
        </div>

        {/* Message */}
        <p className="text-center text-xl font-semibold text-gray-800 mb-6">
          {message}
        </p>

        {/* Close Button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="bg-brandGold text-white py-3 px-8 rounded-full font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};