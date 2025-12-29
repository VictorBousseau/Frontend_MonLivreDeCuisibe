/**
 * RecipeCard - Carte d'affichage d'une recette avec auteur
 */
import { Link } from 'react-router-dom';

const categorieColors = {
    'Entrée': 'bg-green-500',
    'Plat': 'bg-orange-500',
    'Dessert': 'bg-pink-500',
    'Gourmandises': 'bg-amber-500',
};

export default function RecipeCard({ recipe, onAuthorClick }) {
    const bgColor = categorieColors[recipe.categorie] || 'bg-gray-500';

    const handleAuthorClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAuthorClick) {
            onAuthorClick(recipe.auteur_id, recipe.auteur?.nom);
        }
    };

    return (
        <Link
            to={`/recipes/${recipe.id}`}
            className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
        >
            {/* Bandeau catégorie */}
            <div className={`${bgColor} text-white text-sm font-semibold px-4 py-2 flex justify-between items-center`}>
                <span>{recipe.categorie}</span>
                {recipe.auteur && (
                    <button
                        onClick={handleAuthorClick}
                        className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                        title={`Voir les recettes de ${recipe.auteur.nom}`}
                    >
                        👤 {recipe.auteur.nom}
                    </button>
                )}
            </div>

            <div className="p-5">
                {/* Titre */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {recipe.titre}
                </h3>

                {/* Temps */}
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                    {recipe.temps_prep && (
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Prep: {recipe.temps_prep} min</span>
                        </div>
                    )}
                    {recipe.temps_cuisson && (
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            </svg>
                            <span>Cuisson: {recipe.temps_cuisson} min</span>
                        </div>
                    )}
                </div>

                {/* Température */}
                {recipe.temperature && (
                    <div className="mt-2 text-gray-500 text-sm">
                        🌡️ {recipe.temperature}°C
                    </div>
                )}
            </div>
        </Link>
    );
}
