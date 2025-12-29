/**
 * SaisonPage - Guide des fruits et légumes de saison
 * Données basées sur le calendrier français
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';

const MOIS = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const SAISONS = {
    Janvier: {
        legumes: ['Ail', 'Betterave', 'Carotte', 'Céleri', 'Chou', 'Courge', 'Endive', 'Épinard', 'Frisée', 'Mâche', 'Navet', 'Panais', 'Poireau', 'Topinambour'],
        fruits: ['Amande sèche', 'Citron', 'Clémentine', 'Kaki', 'Kiwi', 'Mandarine', 'Orange', 'Pamplemousse', 'Physalis', 'Poire', 'Pomme'],
        cereales: ['Lentille']
    },
    Février: {
        legumes: ['Ail', 'Betterave', 'Carotte', 'Céleri-rave', 'Chou', 'Endive', 'Épinard', 'Frisée', 'Mâche', 'Navet', 'Panais', 'Poireau', 'Radis', 'Salsifi', 'Topinambour'],
        fruits: ['Amande sèche', 'Citron', 'Clémentine', 'Kiwi', 'Mandarine', 'Orange', 'Pamplemousse', 'Physalis', 'Poire', 'Pomme'],
        cereales: ['Lentille']
    },
    Mars: {
        legumes: ['Ail', 'Asperge', 'Betterave', 'Blette', 'Carotte', 'Céleri-rave', 'Chou', 'Crosne', 'Endive', 'Épinard', 'Frisée', 'Navet', 'Panais', 'Poireau', 'Radis', 'Salsifi', 'Topinambour'],
        fruits: ['Amande sèche', 'Citron', 'Kiwi', 'Orange', 'Pamplemousse', 'Poire', 'Pomme'],
        cereales: ['Lentille']
    },
    Avril: {
        legumes: ['Ail', 'Artichaut', 'Asperge', 'Betterave', 'Blette', 'Carotte', 'Chou-fleur', 'Concombre', 'Endive', 'Épinard', 'Frisée', 'Laitue', 'Navet', 'Oignon', 'Petit pois', 'Poireau', 'Radis'],
        fruits: ['Amande sèche', 'Citron', 'Pamplemousse', 'Poire', 'Pomme'],
        cereales: []
    },
    Mai: {
        legumes: ['Ail', 'Artichaut', 'Asperge', 'Aubergine', 'Betterave', 'Blette', 'Carotte', 'Chou-fleur', 'Concombre', 'Courgette', 'Épinard', 'Laitue', 'Navet', 'Oignon', 'Petit pois', 'Radis'],
        fruits: ['Amande sèche', 'Cerise', 'Fraise', 'Pamplemousse', 'Rhubarbe', 'Tomate'],
        cereales: []
    },
    Juin: {
        legumes: ['Ail', 'Artichaut', 'Asperge', 'Aubergine', 'Blette', 'Brocoli', 'Carotte', 'Chou romanesco', 'Concombre', 'Courgette', 'Épinard', 'Fenouil', 'Haricot vert', 'Laitue', 'Navet', 'Petit pois', 'Poivron', 'Radis'],
        fruits: ['Abricot', 'Amande sèche', 'Brugnon', 'Cassis', 'Cerise', 'Citron', 'Fraise', 'Framboise', 'Groseille', 'Melon', 'Pamplemousse', 'Pastèque', 'Pêche', 'Pomme', 'Prune', 'Rhubarbe', 'Tomate'],
        cereales: ['Avoine', 'Orge d\'hiver', 'Pois', 'Seigle']
    },
    Juillet: {
        legumes: ['Ail', 'Artichaut', 'Asperge', 'Aubergine', 'Betterave', 'Blette', 'Brocoli', 'Carotte', 'Céleri-branche', 'Concombre', 'Courgette', 'Épinard', 'Fenouil', 'Haricot vert', 'Laitue', 'Petit pois', 'Poivron', 'Radis'],
        fruits: ['Abricot', 'Amande fraîche', 'Amande sèche', 'Brugnon', 'Cassis', 'Cerise', 'Figue', 'Fraise', 'Framboise', 'Groseille', 'Melon', 'Myrtille', 'Nectarine', 'Pastèque', 'Pêche', 'Poire', 'Prune', 'Rhubarbe', 'Tomate'],
        cereales: ['Avoine', 'Blé dur', 'Blé tendre', 'Féveroles et fèves', 'Haricot blanc', 'Maïs', 'Orge', 'Pois', 'Seigle']
    },
    Août: {
        legumes: ['Ail', 'Artichaut', 'Aubergine', 'Betterave', 'Blette', 'Brocoli', 'Carotte', 'Céleri-branche', 'Chou', 'Courge', 'Courgette', 'Épinard', 'Fenouil', 'Frisée', 'Haricot vert', 'Laitue', 'Poivron', 'Radis'],
        fruits: ['Abricot', 'Amande fraîche', 'Amande sèche', 'Baie de goji', 'Brugnon', 'Cassis', 'Figue', 'Fraise', 'Framboise', 'Groseille', 'Melon', 'Mirabelle', 'Mûre', 'Myrtille', 'Nectarine', 'Noisette', 'Pastèque', 'Pêche', 'Poire', 'Pomme', 'Prune', 'Pruneau', 'Raisin', 'Tomate'],
        cereales: ['Avoine', 'Blé dur', 'Blé tendre', 'Féveroles et fèves', 'Haricot blanc', 'Maïs', 'Orge', 'Pois', 'Quinoa', 'Seigle']
    },
    Septembre: {
        legumes: ['Ail', 'Artichaut', 'Aubergine', 'Betterave', 'Blette', 'Brocoli', 'Carotte', 'Céleri-branche', 'Chou', 'Concombre', 'Courge', 'Courgette', 'Épinard', 'Fenouil', 'Frisée', 'Haricot vert', 'Laitue', 'Panais', 'Patate douce', 'Poireau', 'Poivron', 'Potiron', 'Radis'],
        fruits: ['Amande sèche', 'Baie de goji', 'Coing', 'Figue', 'Melon', 'Mirabelle', 'Mûre', 'Myrtille', 'Noisette', 'Noix', 'Pastèque', 'Pêche', 'Poire', 'Pomme', 'Prune', 'Pruneau', 'Raisin', 'Tomate'],
        cereales: ['Haricot blanc', 'Maïs', 'Quinoa', 'Riz', 'Sarrasin', 'Tournesol']
    },
    Octobre: {
        legumes: ['Ail', 'Aubergine', 'Betterave', 'Blette', 'Brocoli', 'Carotte', 'Céleri', 'Chou', 'Concombre', 'Courge', 'Courgette', 'Échalote', 'Endive', 'Épinard', 'Fenouil', 'Frisée', 'Haricot vert', 'Laitue', 'Navet', 'Panais', 'Patate douce', 'Poireau', 'Radis', 'Rutabaga', 'Salsifi', 'Topinambour'],
        fruits: ['Amande sèche', 'Baie de goji', 'Châtaigne', 'Citron', 'Coing', 'Figue', 'Framboise', 'Kaki', 'Myrtille', 'Noisette', 'Noix', 'Physalis', 'Poire', 'Pomme', 'Raisin', 'Tomate'],
        cereales: ['Haricot blanc', 'Maïs', 'Quinoa', 'Riz', 'Sarrasin', 'Soja']
    },
    Novembre: {
        legumes: ['Ail', 'Betterave', 'Brocoli', 'Cardon', 'Carotte', 'Céleri', 'Chou', 'Courge', 'Crosne', 'Échalote', 'Endive', 'Épinard', 'Fenouil', 'Frisée', 'Mâche', 'Navet', 'Panais', 'Poireau', 'Radis', 'Rutabaga', 'Salsifi', 'Topinambour'],
        fruits: ['Amande sèche', 'Châtaigne', 'Citron', 'Clémentine', 'Coing', 'Kaki', 'Kiwi', 'Mandarine', 'Orange', 'Physalis', 'Poire', 'Pomme'],
        cereales: ['Lentille', 'Maïs']
    },
    Décembre: {
        legumes: ['Ail', 'Betterave', 'Carotte', 'Céleri', 'Chou', 'Courge', 'Crosne', 'Échalote', 'Endive', 'Épinard', 'Frisée', 'Mâche', 'Navet', 'Panais', 'Poireau', 'Radis', 'Rutabaga', 'Salsifi', 'Topinambour'],
        fruits: ['Amande sèche', 'Châtaigne', 'Citron', 'Clémentine', 'Kaki', 'Kiwi', 'Mandarine', 'Orange', 'Physalis', 'Poire', 'Pomme'],
        cereales: ['Avoine', 'Blé dur', 'Blé tendre', 'Féveroles et fèves', 'Lentille', 'Orge', 'Pois', 'Seigle']
    }
};

const SAISON_COLORS = {
    Janvier: 'from-blue-400 to-blue-600',
    Février: 'from-blue-300 to-blue-500',
    Mars: 'from-green-300 to-green-500',
    Avril: 'from-green-400 to-emerald-500',
    Mai: 'from-emerald-400 to-green-500',
    Juin: 'from-yellow-400 to-orange-500',
    Juillet: 'from-orange-400 to-red-500',
    Août: 'from-orange-500 to-red-600',
    Septembre: 'from-amber-400 to-orange-500',
    Octobre: 'from-orange-400 to-amber-600',
    Novembre: 'from-gray-400 to-gray-600',
    Décembre: 'from-blue-500 to-indigo-600'
};

export default function SaisonPage() {
    const moisActuel = MOIS[new Date().getMonth()];
    const [selectedMois, setSelectedMois] = useState(moisActuel);

    const data = SAISONS[selectedMois];

    return (
        <div className="max-w-6xl mx-auto">
            {/* En-tête */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    🌿 Fruits & Légumes de Saison
                </h1>
                <p className="text-gray-600">
                    Mangez local et de saison pour une alimentation responsable
                </p>
            </div>

            {/* Sélecteur de mois */}
            <div className="mb-8">
                <div className="flex flex-wrap justify-center gap-2">
                    {MOIS.map((mois) => (
                        <button
                            key={mois}
                            onClick={() => setSelectedMois(mois)}
                            className={`px-3 py-2 rounded-lg font-medium transition-all ${selectedMois === mois
                                    ? `bg-gradient-to-r ${SAISON_COLORS[mois]} text-white shadow-lg`
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {mois}
                        </button>
                    ))}
                </div>
            </div>

            {/* Contenu du mois */}
            <div className={`bg-gradient-to-r ${SAISON_COLORS[selectedMois]} rounded-2xl p-8 text-white mb-8`}>
                <h2 className="text-3xl font-bold text-center mb-2">{selectedMois}</h2>
                <p className="text-center opacity-80">
                    {data.legumes.length} légumes • {data.fruits.length} fruits • {data.cereales.length} céréales
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Légumes */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        🥕 Légumes
                        <span className="text-sm font-normal text-gray-500">
                            ({data.legumes.length})
                        </span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {data.legumes.map((legume) => (
                            <span
                                key={legume}
                                className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                            >
                                {legume}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Fruits */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        🍎 Fruits
                        <span className="text-sm font-normal text-gray-500">
                            ({data.fruits.length})
                        </span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {data.fruits.map((fruit) => (
                            <span
                                key={fruit}
                                className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                            >
                                {fruit}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Céréales & Légumineuses */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        🌾 Céréales & Légumineuses
                        <span className="text-sm font-normal text-gray-500">
                            ({data.cereales.length})
                        </span>
                    </h3>
                    {data.cereales.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {data.cereales.map((cereale) => (
                                <span
                                    key={cereale}
                                    className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium"
                                >
                                    {cereale}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic">Pas de récolte ce mois-ci</p>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="mt-8 bg-blue-50 rounded-2xl p-6 text-center">
                <p className="text-blue-800">
                    💡 <strong>Astuce :</strong> Privilégiez les produits locaux et de saison
                    pour réduire votre empreinte carbone et profiter de saveurs optimales !
                </p>
            </div>

            {/* Lien retour */}
            <div className="mt-8 text-center">
                <Link to="/" className="text-orange-500 hover:text-orange-600 font-medium">
                    ← Retour aux recettes
                </Link>
            </div>
        </div>
    );
}
