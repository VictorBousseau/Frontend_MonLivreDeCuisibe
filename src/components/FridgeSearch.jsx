/**
 * FridgeSearch - Composant de recherche "Frigo"
 * Permet de chercher des recettes par ingrédients disponibles
 */
import { useState } from 'react';
import { frigoAPI } from '../api';
import RecipeCard from './RecipeCard';

export default function FridgeSearch() {
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState('');
    const [strictMode, setStrictMode] = useState(false);

    const handleSearch = async () => {
        if (!inputValue.trim()) return;

        setLoading(true);
        setError('');
        setSearched(true);

        try {
            // Parser les ingrédients (séparés par virgule)
            const ingredients = inputValue
                .split(',')
                .map((ing) => ing.trim())
                .filter((ing) => ing);

            const response = await frigoAPI.search(ingredients, strictMode);
            setResults(response.data);
        } catch (err) {
            setError('Erreur lors de la recherche');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* En-tête */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    🧊 Recherche Frigo
                </h1>
                <p className="text-gray-600">
                    Entrez les ingrédients que vous avez, trouvez les recettes que vous pouvez faire !
                </p>
            </div>

            {/* Champ de recherche */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vos ingrédients disponibles (séparés par des virgules)
                </label>
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ex: tomate, oeuf, fromage, poulet"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading || !inputValue.trim()}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Recherche...' : '🔍 Chercher'}
                    </button>
                </div>

                {/* Toggle Mode Strict */}
                <div className="mt-4 flex items-center gap-3">
                    <button
                        onClick={() => setStrictMode(!strictMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${strictMode ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                    >
                        <span
                            className={`${strictMode ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                    </button>
                    <span
                        className={`text-sm font-medium cursor-pointer ${strictMode ? 'text-blue-700' : 'text-gray-500'}`}
                        onClick={() => setStrictMode(!strictMode)}
                    >
                        {strictMode ? "Mode Strict : Recettes complètes uniquement" : "Mode Large : Recettes contenant ces ingrédients"}
                    </span>
                </div>

                {/* Tags des ingrédients recherchés */}
                {inputValue && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {inputValue.split(',').map((ing, i) => {
                            const trimmed = ing.trim();
                            if (!trimmed) return null;
                            return (
                                <span
                                    key={i}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                >
                                    {trimmed}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Erreur */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
            )}

            {/* Résultats */}
            {searched && !loading && (
                <div>
                    {results.length > 0 ? (
                        <>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                🎉 {results.length} recette(s) trouvée(s)
                            </h2>
                            <div className="space-y-4">
                                {results.map((result) => (
                                    <div
                                        key={result.recipe.id}
                                        className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-4"
                                    >
                                        {/* Badge match count */}
                                        <div className={`flex-shrink-0 w-16 h-16 rounded-full flex flex-col items-center justify-center text-white ${result.match_count === result.recipe.ingredients?.length
                                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 ring-4 ring-green-100'
                                                : 'bg-gradient-to-br from-blue-400 to-blue-600'
                                            }`}>
                                            <span className="text-xl font-bold">{result.match_count}</span>
                                            <span className="text-xs">match</span>
                                        </div>

                                        {/* Info recette */}
                                        <div className="flex-1">
                                            <RecipeCard recipe={result.recipe} />
                                        </div>

                                        {/* Ingrédients matchés */}
                                        <div className="hidden md:block flex-shrink-0 w-48">
                                            <p className="text-xs text-gray-500 mb-1">Ingrédients trouvés:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {result.matched_ingredients.map((ing, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs"
                                                    >
                                                        {ing}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl shadow">
                            <div className="text-6xl mb-4">😕</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Aucune recette trouvée {strictMode ? "en mode strict" : ""}
                            </h3>
                            <p className="text-gray-600">
                                {strictMode
                                    ? "Essayez de désactiver le mode strict pour plus de résultats."
                                    : "Essayez avec d'autres ingrédients ou ajoutez de nouvelles recettes !"
                                }
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
