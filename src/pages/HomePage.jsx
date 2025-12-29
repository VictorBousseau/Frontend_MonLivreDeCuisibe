/**
 * HomePage - Affichage des recettes par catégorie
 */
import { useState, useEffect } from 'react';
import { recipesAPI } from '../api';
import RecipeCard from '../components/RecipeCard';

const CATEGORIES = ['Entrée', 'Plat', 'Dessert'];

export default function HomePage() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await recipesAPI.getAll();
                setRecipes(response.data);
            } catch (err) {
                setError('Erreur lors du chargement des recettes');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    // Grouper les recettes par catégorie
    const groupedRecipes = CATEGORIES.reduce((acc, cat) => {
        acc[cat] = recipes.filter((r) => r.categorie === cat);
        return acc;
    }, {});

    // Filtrer selon la sélection
    const displayCategories = filter === 'all' ? CATEGORIES : [filter];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div>
            {/* En-tête */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    📖 Mon Livre de Cuisine
                </h1>
                <p className="text-gray-600">
                    Toutes les recettes de famille au même endroit
                </p>
            </div>

            {/* Filtres */}
            <div className="flex justify-center gap-2 mb-8">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${filter === 'all'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Toutes
                </button>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full font-medium transition-colors ${filter === cat
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
                    {error}
                </div>
            )}

            {recipes.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow">
                    <div className="text-6xl mb-4">🍳</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Aucune recette pour l'instant
                    </h3>
                    <p className="text-gray-600">
                        Commencez par ajouter votre première recette !
                    </p>
                </div>
            ) : (
                <div className="space-y-10">
                    {displayCategories.map((cat) => {
                        const catRecipes = groupedRecipes[cat];
                        if (catRecipes.length === 0 && filter !== 'all') return null;
                        if (catRecipes.length === 0) return null;

                        return (
                            <div key={cat}>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    {cat === 'Entrée' && '🥗'}
                                    {cat === 'Plat' && '🍝'}
                                    {cat === 'Dessert' && '🍰'}
                                    {cat}
                                    <span className="text-sm font-normal text-gray-500">
                                        ({catRecipes.length})
                                    </span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {catRecipes.map((recipe) => (
                                        <RecipeCard key={recipe.id} recipe={recipe} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
