import React from 'react'; // Import React
import ReactDOM from 'react-dom/client';
import App from './App'; // Ensure the path is correct
import './index.css'; // Import global CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
