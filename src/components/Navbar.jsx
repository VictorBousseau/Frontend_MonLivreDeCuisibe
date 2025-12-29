/**
 * Navbar - Barre de navigation principale
 */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
                        <span className="text-2xl">🍳</span>
                        MonLivreDeCuisine
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-6">
                        <Link
                            to="/"
                            className="text-white/90 hover:text-white transition-colors font-medium"
                        >
                            Recettes
                        </Link>
                        <Link
                            to="/frigo"
                            className="text-white/90 hover:text-white transition-colors font-medium"
                        >
                            🧊 Frigo
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to="/new"
                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-medium"
                                >
                                    + Nouvelle recette
                                </Link>
                                {user.is_admin && (
                                    <Link
                                        to="/admin"
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                                    >
                                        👑 Admin
                                    </Link>
                                )}
                                <div className="flex items-center gap-3">
                                    <span className="text-white/90 text-sm">👤 {user.nom}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-white/80 hover:text-white text-sm transition-colors"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-white text-orange-500 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Connexion
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
