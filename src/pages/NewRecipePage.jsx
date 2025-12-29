/**
 * NewRecipePage - Page de création de recette
 */
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';

export default function NewRecipePage() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            </div>
        );
    }

    // Rediriger vers login si non connecté
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="py-8">
            <RecipeForm />
        </div>
    );
}
