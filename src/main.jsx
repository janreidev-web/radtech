import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import App from './App.jsx';

// ✅ Define your routes
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
    },
  ],
  {
    // ✅ These flags go in createBrowserRouter
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

// ✅ Render with v7_startTransition on RouterProvider
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider 
      router={router} 
      future={{ v7_startTransition: true }} 
    />
  </StrictMode>
);
