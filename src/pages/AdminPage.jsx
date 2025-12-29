/**
 * AdminPage - Dashboard d'administration
 * Liste des utilisateurs avec leurs recettes
 */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, recipesAPI } from '../api';

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && (!user || !user.is_admin)) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const [usersRes, recipesRes] = await Promise.all([
                    adminAPI.getUsers(),
                    recipesAPI.getAll()
                ]);
                setUsers(usersRes.data);
                setRecipes(recipesRes.data);
            } catch (err) {
                if (err.response?.status === 403) {
                    navigate('/');
                } else {
                    setError('Erreur lors du chargement des données');
                }
            } finally {
                setLoading(false);
            }
        };

        if (user?.is_admin) {
            fetchData();
        }
    }, [user, authLoading, navigate]);

    const handleToggleAdmin = async (userId) => {
        try {
            await adminAPI.toggleAdmin(userId);
            // Rafraîchir la liste
            const res = await adminAPI.getUsers();
            setUsers(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Erreur');
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!confirm(`Supprimer l'utilisateur ${userName} et toutes ses recettes ?`)) return;

        try {
            await adminAPI.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            // Rafraîchir les recettes
            const res = await recipesAPI.getAll();
            setRecipes(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Erreur');
        }
    };

    // Compter les recettes par utilisateur
    const getRecipeCount = (userId) => {
        return recipes.filter(r => r.auteur_id === userId).length;
    };

    // Récupérer les recettes d'un utilisateur
    const getUserRecipes = (userId) => {
        return recipes.filter(r => r.auteur_id === userId);
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!user?.is_admin) {
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    👑 Administration
                </h1>
                <p className="text-gray-600 mt-2">
                    Gérer les utilisateurs et leurs recettes
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                    <button onClick={() => setError('')} className="ml-4">✕</button>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <div className="text-4xl font-bold text-orange-500">{users.length}</div>
                    <div className="text-gray-600">Utilisateurs</div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <div className="text-4xl font-bold text-green-500">{recipes.length}</div>
                    <div className="text-gray-600">Recettes</div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <div className="text-4xl font-bold text-purple-500">
                        {users.filter(u => u.is_admin).length}
                    </div>
                    <div className="text-gray-600">Admins</div>
                </div>
            </div>

            {/* Liste des utilisateurs */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        👥 Liste des utilisateurs
                    </h2>
                </div>

                <div className="divide-y">
                    {users.map((u) => (
                        <div key={u.id} className="p-6 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${u.is_admin ? 'bg-purple-500' : 'bg-gray-400'}`}>
                                        {u.nom.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-800">{u.nom}</span>
                                            {u.is_admin && (
                                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">{u.email}</div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            📝 {getRecipeCount(u.id)} recette(s)
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {u.id !== user.id && (
                                        <>
                                            <button
                                                onClick={() => handleToggleAdmin(u.id)}
                                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${u.is_admin
                                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                    }`}
                                            >
                                                {u.is_admin ? 'Retirer admin' : 'Promouvoir admin'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u.id, u.nom)}
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                                            >
                                                Supprimer
                                            </button>
                                        </>
                                    )}
                                    {u.id === user.id && (
                                        <span className="text-sm text-gray-400 italic">C'est vous</span>
                                    )}
                                </div>
                            </div>

                            {/* Recettes de l'utilisateur */}
                            {getRecipeCount(u.id) > 0 && (
                                <div className="mt-4 pl-16">
                                    <div className="flex flex-wrap gap-2">
                                        {getUserRecipes(u.id).slice(0, 5).map(recipe => (
                                            <Link
                                                key={recipe.id}
                                                to={`/recipes/${recipe.id}`}
                                                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                                            >
                                                {recipe.titre}
                                            </Link>
                                        ))}
                                        {getRecipeCount(u.id) > 5 && (
                                            <span className="text-xs text-gray-400">
                                                +{getRecipeCount(u.id) - 5} autres
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
