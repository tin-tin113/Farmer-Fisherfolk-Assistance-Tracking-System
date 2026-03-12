import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LGUSettingsProvider } from './context/LGUSettingsContext';
import { LoginPage } from './components/LoginPage';

function AuthGate() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <LGUSettingsProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </LGUSettingsProvider>
  );
}