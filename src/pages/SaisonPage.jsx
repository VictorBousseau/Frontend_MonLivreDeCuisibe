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
        legumes: ['Carotte', 'Céleri', 'Chou', 'Chou de Bruxelles', 'Chou-fleur', 'Endive', 'Épinard', 'Mâche', 'Navet', 'Oignon', 'Poireau', 'Pomme de terre', 'Potiron', 'Topinambour'],
        fruits: ['Citron', 'Clémentine', 'Kiwi', 'Mandarine', 'Orange', 'Pamplemousse', 'Poire', 'Pomme']
    },
    Février: {
        legumes: ['Carotte', 'Céleri', 'Chou', 'Chou de Bruxelles', 'Chou-fleur', 'Endive', 'Épinard', 'Mâche', 'Navet', 'Oignon', 'Poireau', 'Pomme de terre', 'Topinambour'],
        fruits: ['Citron', 'Clémentine', 'Kiwi', 'Mandarine', 'Orange', 'Pamplemousse', 'Poire', 'Pomme']
    },
    Mars: {
        legumes: ['Carotte', 'Céleri', 'Chou', 'Chou-fleur', 'Endive', 'Épinard', 'Navet', 'Oignon', 'Poireau', 'Pomme de terre', 'Radis'],
        fruits: ['Citron', 'Kiwi', 'Orange', 'Pamplemousse', 'Poire', 'Pomme']
    },
    Avril: {
        legumes: ['Artichaut', 'Asperge', 'Carotte', 'Épinard', 'Oignon', 'Petit pois', 'Pomme de terre', 'Radis'],
        fruits: ['Citron', 'Pamplemousse', 'Pomme', 'Rhubarbe']
    },
    Mai: {
        legumes: ['Artichaut', 'Asperge', 'Carotte', 'Chou-fleur', 'Concombre', 'Courgette', 'Épinard', 'Laitue', 'Oignon', 'Petit pois', 'Radis'],
        fruits: ['Cerise', 'Fraise', 'Rhubarbe']
    },
    Juin: {
        legumes: ['Artichaut', 'Asperge', 'Aubergine', 'Carotte', 'Concombre', 'Courgette', 'Haricot vert', 'Laitue', 'Oignon', 'Petit pois', 'Poivron', 'Radis', 'Tomate'],
        fruits: ['Abricot', 'Cerise', 'Fraise', 'Framboise', 'Melon', 'Pêche']
    },
    Juillet: {
        legumes: ['Artichaut', 'Aubergine', 'Carotte', 'Concombre', 'Courgette', 'Haricot vert', 'Laitue', 'Oignon', 'Poivron', 'Radis', 'Tomate'],
        fruits: ['Abricot', 'Cassis', 'Cerise', 'Figue', 'Fraise', 'Framboise', 'Groseille', 'Melon', 'Myrtille', 'Nectarine', 'Pastèque', 'Pêche', 'Prune']
    },
    Août: {
        legumes: ['Artichaut', 'Aubergine', 'Carotte', 'Concombre', 'Courgette', 'Haricot vert', 'Laitue', 'Oignon', 'Poivron', 'Radis', 'Tomate'],
        fruits: ['Abricot', 'Cassis', 'Figue', 'Fraise', 'Framboise', 'Melon', 'Mirabelle', 'Mûre', 'Myrtille', 'Nectarine', 'Pastèque', 'Pêche', 'Poire', 'Prune', 'Raisin']
    },
    Septembre: {
        legumes: ['Aubergine', 'Carotte', 'Chou', 'Chou-fleur', 'Concombre', 'Courgette', 'Épinard', 'Haricot vert', 'Laitue', 'Oignon', 'Poireau', 'Poivron', 'Potiron', 'Tomate'],
        fruits: ['Figue', 'Melon', 'Mirabelle', 'Mûre', 'Myrtille', 'Pêche', 'Poire', 'Pomme', 'Prune', 'Raisin']
    },
    Octobre: {
        legumes: ['Carotte', 'Céleri', 'Chou', 'Chou de Bruxelles', 'Chou-fleur', 'Courge', 'Endive', 'Épinard', 'Navet', 'Oignon', 'Poireau', 'Pomme de terre', 'Potiron'],
        fruits: ['Châtaigne', 'Coing', 'Figue', 'Noix', 'Poire', 'Pomme', 'Raisin']
    },
    Novembre: {
        legumes: ['Carotte', 'Céleri', 'Chou', 'Chou de Bruxelles', 'Chou-fleur', 'Courge', 'Endive', 'Épinard', 'Mâche', 'Navet', 'Oignon', 'Poireau', 'Pomme de terre', 'Potiron', 'Topinambour'],
        fruits: ['Châtaigne', 'Clémentine', 'Coing', 'Kiwi', 'Mandarine', 'Orange', 'Poire', 'Pomme']
    },
    Décembre: {
        legumes: ['Carotte', 'Céleri', 'Chou', 'Chou de Bruxelles', 'Chou-fleur', 'Courge', 'Endive', 'Épinard', 'Mâche', 'Navet', 'Oignon', 'Poireau', 'Pomme de terre', 'Potiron', 'Topinambour'],
        fruits: ['Châtaigne', 'Clémentine', 'Kiwi', 'Mandarine', 'Orange', 'Pamplemousse', 'Poire', 'Pomme']
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
    // Déterminer le mois actuel
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
                    {data.legumes.length} légumes • {data.fruits.length} fruits
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Légumes */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
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
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
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
