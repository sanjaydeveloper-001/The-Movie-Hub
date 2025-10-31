import { createRoot } from 'react-dom/client'
import "react-toastify/dist/ReactToastify.css";
import './index.css'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
)
