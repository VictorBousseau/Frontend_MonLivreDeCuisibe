/**
 * RecipeDetailPage - Affichage détaillé d'une recette
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipesAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const categorieColors = {
    'Entrée': 'from-green-400 to-green-600',
    'Plat': 'from-orange-400 to-orange-600',
    'Dessert': 'from-pink-400 to-pink-600',
    'Gourmandises': 'from-amber-400 to-amber-600',
};

export default function RecipeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await recipesAPI.getById(id);
                setRecipe(response.data);
            } catch (err) {
                setError('Recette non trouvée');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) return;

        setDeleting(true);
        try {
            await recipesAPI.delete(id);
            navigate('/');
        } catch (err) {
            setError('Erreur lors de la suppression');
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
                <Link to="/" className="text-orange-500 hover:underline">
                    ← Retour à l'accueil
                </Link>
            </div>
        );
    }

    const bgGradient = categorieColors[recipe.categorie] || 'from-gray-400 to-gray-600';
    const isAuthor = user && user.id === recipe.auteur_id;
    const canEdit = isAuthor || (user && user.is_admin);

    return (
        <div className="max-w-4xl mx-auto">
            {/* En-tête avec gradient */}
            <div className={`bg-gradient-to-r ${bgGradient} rounded-2xl p-8 text-white mb-8`}>
                <div className="flex items-start justify-between">
                    <div>
                        <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-3">
                            {recipe.categorie}
                        </span>
                        <h1 className="text-4xl font-bold mb-2">{recipe.titre}</h1>
                        <p className="opacity-80">
                            Par {recipe.auteur.nom}
                        </p>
                    </div>

                    {/* Actions auteur ou admin */}
                    {canEdit && (
                        <div className="flex gap-2">
                            <Link
                                to={`/edit/${recipe.id}`}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                            >
                                ✏️ Modifier
                            </Link>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {deleting ? '...' : '🗑️ Supprimer'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Infos temps */}
                <div className="flex gap-6 mt-6">
                    {recipe.temps_prep && (
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">⏱️</span>
                            <div>
                                <p className="text-sm opacity-80">Préparation</p>
                                <p className="font-semibold">{recipe.temps_prep} min</p>
                            </div>
                        </div>
                    )}
                    {recipe.temps_cuisson && (
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🔥</span>
                            <div>
                                <p className="text-sm opacity-80">Cuisson</p>
                                <p className="font-semibold">{recipe.temps_cuisson} min</p>
                            </div>
                        </div>
                    )}
                    {recipe.temperature && (
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🌡️</span>
                            <div>
                                <p className="text-sm opacity-80">Température</p>
                                <p className="font-semibold">{recipe.temperature}°C</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Ingrédients */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        🥕 Ingrédients
                    </h2>
                    {recipe.ingredients.length > 0 ? (
                        <ul className="space-y-2">
                            {recipe.ingredients.map((ing) => (
                                <li key={ing.id} className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                    <span>
                                        {ing.quantite && <strong>{ing.quantite}</strong>}
                                        {ing.unite && ` ${ing.unite}`}
                                        {ing.quantite && ' '}{ing.nom}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Aucun ingrédient</p>
                    )}
                </div>

                {/* Étapes */}
                <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        📝 Préparation
                    </h2>
                    {recipe.steps.length > 0 ? (
                        <ol className="space-y-4">
                            {recipe.steps.map((step, index) => (
                                <li key={step.id} className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-full flex items-center justify-center font-bold">
                                        {index + 1}
                                    </span>
                                    <p className="text-gray-700 pt-1 whitespace-pre-wrap">{step.description}</p>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className="text-gray-500">Aucune étape définie</p>
                    )}
                </div>
            </div>

            {/* Lien retour */}
            <div className="mt-8 text-center">
                <Link
                    to="/"
                    className="text-orange-500 hover:text-orange-600 font-medium"
                >
                    ← Retour aux recettes
                </Link>
            </div>
        </div>
    );
}
