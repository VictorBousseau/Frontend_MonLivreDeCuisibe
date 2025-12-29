/**
 * EditRecipePage - Page de modification d'une recette
 */
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recipesAPI } from '../api';
import RecipeForm from '../components/RecipeForm';

export default function EditRecipePage() {
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            </div>
        );
    }

    // Rediriger si non connecté
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-2xl font-bold text-gray-800">{error}</h2>
            </div>
        );
    }

    // Vérifier que l'utilisateur est l'auteur ou admin
    if (recipe && recipe.auteur_id !== user.id && !user.is_admin) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🚫</div>
                <h2 className="text-2xl font-bold text-gray-800">Accès non autorisé</h2>
                <p className="text-gray-600 mt-2">Vous ne pouvez modifier que vos propres recettes.</p>
            </div>
        );
    }

    return (
        <div className="py-8">
            {recipe && <RecipeForm initialData={recipe} />}
        </div>
    );
}
