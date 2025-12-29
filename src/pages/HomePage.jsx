/**
 * HomePage - Affichage des recettes avec recherche, filtres par auteur et tags
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

const ALL_TAGS = [
    { value: 'Végétarien', icon: '🥬', color: 'bg-green-100 text-green-700' },
    { value: 'Végan', icon: '🌱', color: 'bg-emerald-100 text-emerald-700' },
    { value: 'Sans gluten', icon: '🌾', color: 'bg-amber-100 text-amber-700' },
    { value: 'Sans lactose', icon: '🥛', color: 'bg-blue-100 text-blue-700' },
    { value: 'Printemps', icon: '🌸', color: 'bg-pink-100 text-pink-700' },
    { value: 'Été', icon: '☀️', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'Automne', icon: '🍂', color: 'bg-orange-100 text-orange-700' },
    { value: 'Hiver', icon: '❄️', color: 'bg-cyan-100 text-cyan-700' },
];

export default function HomePage() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [authorFilter, setAuthorFilter] = useState(null);
    const [authorName, setAuthorName] = useState('');
    const [tagFilter, setTagFilter] = useState(null);

    const fetchRecipes = async (search = '', auteurId = null, tag = null) => {
        setLoading(true);
        try {
            const response = await recipesAPI.getAll(null, search, auteurId, tag);
            setRecipes(response.data);
        } catch (err) {
            setError('Erreur lors du chargement des recettes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes(searchQuery, authorFilter, tagFilter);
    }, [searchQuery, authorFilter, tagFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchInput);
    };

    const clearSearch = () => {
        setSearchInput('');
        setSearchQuery('');
    };

    const handleAuthorClick = (auteurId, nom) => {
        setAuthorFilter(auteurId);
        setAuthorName(nom);
        setSearchQuery('');
        setSearchInput('');
    };

    const clearAuthorFilter = () => {
        setAuthorFilter(null);
        setAuthorName('');
    };

    const handleTagClick = (tag) => {
        setTagFilter(tag);
    };

    const clearTagFilter = () => {
        setTagFilter(null);
    };

    const clearAllFilters = () => {
        clearSearch();
        clearAuthorFilter();
        clearTagFilter();
    };

    // Grouper les recettes par catégorie (insensible à la casse)
    const groupedRecipes = CATEGORIES.reduce((acc, cat) => {
        // Normalisation pour comparer "DESSERT" avec "Dessert"
        acc[cat] = recipes.filter((r) =>
            r.categorie && r.categorie.toLowerCase() === cat.toLowerCase()
        );
        return acc;
    }, {});

    const displayCategories = filter === 'all' ? CATEGORIES : [filter];
    const hasActiveFilters = searchQuery || authorFilter || tagFilter;

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
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-4">
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
                </div>
            </form>

            {/* Filtres par tags */}
            <div className="max-w-4xl mx-auto mb-4">
                <div className="flex flex-wrap justify-center gap-2">
                    {ALL_TAGS.map((tag) => (
                        <button
                            key={tag.value}
                            onClick={() => setTagFilter(tagFilter === tag.value ? null : tag.value)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${tagFilter === tag.value
                                ? `${tag.color} ring-2 ring-offset-1 ring-gray-400`
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {tag.icon} {tag.value}
                        </button>
                    ))}
                </div>
            </div>

            {/* Indicateur de filtres actifs */}
            {hasActiveFilters && (
                <div className="text-center mb-4 flex items-center justify-center gap-2 flex-wrap">
                    {searchQuery && (
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                            🔍 "{searchQuery}"
                            <button onClick={clearSearch} className="ml-2 hover:text-orange-900">✕</button>
                        </span>
                    )}
                    {authorFilter && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                            👤 {authorName}
                            <button onClick={clearAuthorFilter} className="ml-2 hover:text-blue-900">✕</button>
                        </span>
                    )}
                    {tagFilter && (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                            🏷️ {tagFilter}
                            <button onClick={clearTagFilter} className="ml-2 hover:text-purple-900">✕</button>
                        </span>
                    )}
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        Tout effacer
                    </button>
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
                    <div className="text-6xl mb-4">{hasActiveFilters ? '🔍' : '🍳'}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {hasActiveFilters ? 'Aucune recette trouvée' : "Aucune recette pour l'instant"}
                    </h3>
                    <p className="text-gray-600">
                        {hasActiveFilters
                            ? 'Essayez avec d\'autres filtres'
                            : 'Commencez par ajouter votre première recette !'}
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="mt-4 text-orange-500 hover:underline"
                        >
                            Voir toutes les recettes
                        </button>
                    )}
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
                                        <RecipeCard
                                            key={recipe.id}
                                            recipe={recipe}
                                            onAuthorClick={handleAuthorClick}
                                            onTagClick={handleTagClick}
                                        />
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
