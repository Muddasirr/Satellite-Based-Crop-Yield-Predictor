// components/Loader.js
export default function Loader() {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white z-50">
        <div className="loader"></div>
        <style jsx>{`
          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
  
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  