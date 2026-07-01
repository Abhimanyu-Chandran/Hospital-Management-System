import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/react'

// // const clerk_key = 

// if (!clerk_key) {
// 	throw new Error("Clerk Key Required");
// }

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
			<App />
		</ClerkProvider>
	</StrictMode>
)
