/**
 * LoginPage - Page de connexion/inscription
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        password: '',
    });

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.nom, formData.email, formData.password);
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                {/* Tabs */}
                <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 rounded-lg font-medium transition-colors ${isLogin ? 'bg-white shadow text-orange-500' : 'text-gray-500'
                            }`}
                    >
                        Connexion
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 rounded-lg font-medium transition-colors ${!isLogin ? 'bg-white shadow text-orange-500' : 'text-gray-500'
                            }`}
                    >
                        Inscription
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    {isLogin ? '👋 Bon retour !' : '🎉 Créer un compte'}
                </h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Votre nom
                            </label>
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required={!isLogin}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Jean Dupont"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="jean@exemple.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50"
                    >
                        {loading
                            ? 'Chargement...'
                            : isLogin
                                ? 'Se connecter'
                                : "S'inscrire"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
                        ← Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
