/**
 * HomePage - Affichage des recettes par catégorie avec recherche
 */
import { useState, useEffect } from 'react';
import { recipesAPI } from '../api';
import RecipeCard from '../components/RecipeCard';

const CATEGORIES = ['Entrée', 'Plat', 'Dessert', 'Gourmandises'];

const CATEGORY_ICONS = {
    'Entrée': '🥗',
    'Plat': '🍝',
    'Dessert': '🍰',
    'Gourmandises': '🍯',
};

export default function HomePage() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const fetchRecipes = async (search = '') => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            const response = await recipesAPI.getAll(null, search);
            setRecipes(response.data);
        } catch (err) {
            setError('Erreur lors du chargement des recettes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes(searchQuery);
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchInput);
    };

    const clearSearch = () => {
        setSearchInput('');
        setSearchQuery('');
    };

    // Grouper les recettes par catégorie
    const groupedRecipes = CATEGORIES.reduce((acc, cat) => {
        acc[cat] = recipes.filter((r) => r.categorie === cat);
        return acc;
    }, {});

    // Filtrer selon la sélection
    const displayCategories = filter === 'all' ? CATEGORIES : [filter];

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

            {/* Barre de recherche */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Rechercher une recette..."
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
                    >
                        Rechercher
                    </button>
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </form>

            {searchQuery && (
                <div className="text-center mb-4 text-gray-600">
                    Résultats pour "<span className="font-semibold">{searchQuery}</span>"
                </div>
            )}

            {/* Filtres par catégorie */}
            <div className="flex justify-center flex-wrap gap-2 mb-8">
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
                        {CATEGORY_ICONS[cat]} {cat}
                    </button>
                ))}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                </div>
            ) : recipes.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow">
                    <div className="text-6xl mb-4">{searchQuery ? '🔍' : '🍳'}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {searchQuery ? 'Aucune recette trouvée' : "Aucune recette pour l'instant"}
                    </h3>
                    <p className="text-gray-600">
                        {searchQuery
                            ? 'Essayez avec un autre terme de recherche'
                            : 'Commencez par ajouter votre première recette !'}
                    </p>
                </div>
            ) : (
                <div className="space-y-10">
                    {displayCategories.map((cat) => {
                        const catRecipes = groupedRecipes[cat] || [];
                        if (catRecipes.length === 0) return null;

                        return (
                            <div key={cat}>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    {CATEGORY_ICONS[cat]}
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
