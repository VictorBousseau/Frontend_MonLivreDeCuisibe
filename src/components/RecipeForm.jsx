/**
 * RecipeForm - Formulaire d'ajout/modification de recette
 * Avec gestion dynamique des ingrédients, étapes et tags
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipesAPI } from '../api';

const CATEGORIES = ['Entrée', 'Plat', 'Dessert', 'Gourmandises', 'Boisson'];

const ALL_TAGS = {
    regime: [
        { value: 'Végétarien', icon: '🥬', color: 'bg-green-100 text-green-700' },
        { value: 'Végan', icon: '🌱', color: 'bg-emerald-100 text-emerald-700' },
        { value: 'Sans gluten', icon: '🌾', color: 'bg-amber-100 text-amber-700' },
        { value: 'Sans lactose', icon: '🥛', color: 'bg-blue-100 text-blue-700' },
    ],
    type: [
        { value: 'Viande', icon: '🥩', color: 'bg-red-100 text-red-700' },
        { value: 'Poissons', icon: '🐟', color: 'bg-blue-100 text-blue-700' },
    ],
    saison: [
        { value: 'Printemps', icon: '🌸', color: 'bg-pink-100 text-pink-700' },
        { value: 'Été', icon: '☀️', color: 'bg-yellow-100 text-yellow-700' },
        { value: 'Automne', icon: '🍂', color: 'bg-orange-100 text-orange-700' },
        { value: 'Hiver', icon: '❄️', color: 'bg-cyan-100 text-cyan-700' },
    ],
};

export default function RecipeForm({ initialData = null, onSuccess }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Normaliser la catégorie (trouver la correspondance exacte dans la liste)
    const normalizedCategory = initialData?.categorie
        ? CATEGORIES.find(c => c.toLowerCase() === initialData.categorie.toLowerCase()) || initialData.categorie
        : 'Plat';

    // État du formulaire
    const [formData, setFormData] = useState({
        titre: initialData?.titre || '',
        categorie: normalizedCategory,
        temps_prep: initialData?.temps_prep || '',
        temps_cuisson: initialData?.temps_cuisson || '',
        temperature: initialData?.temperature || '',
    });

    // État pour les tags
    const [selectedTags, setSelectedTags] = useState(initialData?.tags || []);

    // État dynamique pour ingrédients
    const [ingredients, setIngredients] = useState(
        initialData?.ingredients || [{ nom: '', quantite: '', unite: '' }]
    );

    // État dynamique pour étapes
    const [steps, setSteps] = useState(
        initialData?.steps || [{ description: '', ordre: 1 }]
    );

    // Handlers pour les champs de base
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handler pour les tags
    const toggleTag = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag)
                ? prev.filter((t) => t !== tag)
                : [...prev, tag]
        );
    };

    // Handlers pour ingrédients dynamiques
    const handleIngredientChange = (index, field, value) => {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { nom: '', quantite: '', unite: '' }]);
    };

    const removeIngredient = (index) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, i) => i !== index));
        }
    };

    // Handlers pour étapes dynamiques
    const handleStepChange = (index, value) => {
        const updated = [...steps];
        updated[index].description = value;
        setSteps(updated);
    };

    const addStep = () => {
        setSteps([...steps, { description: '', ordre: steps.length + 1 }]);
    };

    const removeStep = (index) => {
        if (steps.length > 1) {
            const updated = steps.filter((_, i) => i !== index);
            const reindexed = updated.map((step, i) => ({ ...step, ordre: i + 1 }));
            setSteps(reindexed);
        }
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = {
                ...formData,
                temps_prep: formData.temps_prep ? parseInt(formData.temps_prep) : null,
                temps_cuisson: formData.temps_cuisson ? parseInt(formData.temps_cuisson) : null,
                temperature: formData.temperature ? parseInt(formData.temperature) : null,
                tags: selectedTags,
                ingredients: ingredients
                    .filter((ing) => ing.nom.trim())
                    .map((ing) => ({
                        nom: ing.nom,
                        quantite: ing.quantite ? parseFloat(ing.quantite) : null,
                        unite: ing.unite || null,
                    })),
                steps: steps
                    .filter((step) => step.description.trim())
                    .map((step, index) => ({
                        description: step.description,
                        ordre: index + 1,
                    })),
            };

            if (initialData?.id) {
                await recipesAPI.update(initialData.id, data);
            } else {
                await recipesAPI.create(data);
            }

            if (onSuccess) onSuccess();
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Erreur lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {initialData ? 'Modifier la recette' : 'Nouvelle recette'}
            </h2>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
            )}

            {/* Infos de base */}
            <div className="space-y-4 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titre de la recette *
                    </label>
                    <input
                        type="text"
                        name="titre"
                        value={formData.titre}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Ex: Tarte aux pommes"
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Catégorie *
                        </label>
                        <select
                            name="categorie"
                            value={formData.categorie}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Préparation (min)
                        </label>
                        <input
                            type="number"
                            name="temps_prep"
                            value={formData.temps_prep}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cuisson (min)
                        </label>
                        <input
                            type="number"
                            name="temps_cuisson"
                            value={formData.temps_cuisson}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Température (°C)
                        </label>
                        <input
                            type="number"
                            name="temperature"
                            value={formData.temperature}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🏷️ Tags</h3>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Régime alimentaire</p>
                        <div className="flex flex-wrap gap-2">
                            {ALL_TAGS.regime.map((tag) => (
                                <button
                                    key={tag.value}
                                    type="button"
                                    onClick={() => toggleTag(tag.value)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedTags.includes(tag.value)
                                        ? `${tag.color} ring-2 ring-offset-1 ring-gray-400`
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {tag.icon} {tag.value}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600 mb-2">Type</p>
                        <div className="flex flex-wrap gap-2">
                            {ALL_TAGS.type.map((tag) => (
                                <button
                                    key={tag.value}
                                    type="button"
                                    onClick={() => toggleTag(tag.value)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedTags.includes(tag.value)
                                        ? `${tag.color} ring-2 ring-offset-1 ring-gray-400`
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {tag.icon} {tag.value}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600 mb-2">Saison</p>
                        <div className="flex flex-wrap gap-2">
                            {ALL_TAGS.saison.map((tag) => (
                                <button
                                    key={tag.value}
                                    type="button"
                                    onClick={() => toggleTag(tag.value)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedTags.includes(tag.value)
                                        ? `${tag.color} ring-2 ring-offset-1 ring-gray-400`
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {tag.icon} {tag.value}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Ingrédients dynamiques */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">🥕 Ingrédients</h3>
                    <button
                        type="button"
                        onClick={addIngredient}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                        + Ajouter un ingrédient
                    </button>
                </div>

                <div className="space-y-3">
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-3 items-center">
                            <input
                                type="text"
                                value={ingredient.nom}
                                onChange={(e) => handleIngredientChange(index, 'nom', e.target.value)}
                                placeholder="Nom de l'ingrédient"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            />
                            <input
                                type="number"
                                value={ingredient.quantite}
                                onChange={(e) => handleIngredientChange(index, 'quantite', e.target.value)}
                                placeholder="Qté"
                                className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            />
                            <input
                                type="text"
                                value={ingredient.unite}
                                onChange={(e) => handleIngredientChange(index, 'unite', e.target.value)}
                                placeholder="Unité"
                                className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                type="button"
                                onClick={() => removeIngredient(index)}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Étapes dynamiques */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">📝 Étapes de préparation</h3>
                    <button
                        type="button"
                        onClick={addStep}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                        + Ajouter une étape
                    </button>
                </div>

                <div className="space-y-3">
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-3 items-start">
                            <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                                {index + 1}
                            </span>
                            <textarea
                                value={step.description}
                                onChange={(e) => handleStepChange(index, e.target.value)}
                                placeholder={`Décrivez l'étape ${index + 1}...`}
                                rows={2}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
                            />
                            <button
                                type="button"
                                onClick={() => removeStep(index)}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bouton de soumission */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Enregistrement...' : initialData ? 'Mettre à jour' : 'Créer la recette'}
                </button>
            </div>
        </form>
    );
}
