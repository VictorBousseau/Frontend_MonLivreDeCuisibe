/**
 * App.jsx - Point d'entrée principal avec routing
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import NewRecipePage from './pages/NewRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import FridgeSearchPage from './pages/FridgeSearchPage';
import AdminPage from './pages/AdminPage';
import SaisonPage from './pages/SaisonPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/recipes/:id" element={<RecipeDetailPage />} />
              <Route path="/new" element={<NewRecipePage />} />
              <Route path="/edit/:id" element={<EditRecipePage />} />
              <Route path="/frigo" element={<FridgeSearchPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/saison" element={<SaisonPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
