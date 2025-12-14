// app/(legal)/cookies/page.jsx

import Link from "next/link";

export const metadata = {
  title: "Politique des Cookies | Bookzy",
  description: "Comment Bookzy utilise les cookies"
};

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 md:p-12 mb-8 shadow-lg">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Politique des Cookies
          </h1>
          <p className="text-gray-600">
            Dernière mise à jour : 26 novembre 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Qu'est-ce qu'un cookie ?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette, smartphone) 
              lorsque vous visitez un site web. Les cookies permettent au site de mémoriser vos actions et 
              préférences pendant une période donnée.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Types de cookies utilisés
            </h2>
            
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
                <h3 className="font-bold text-green-900 mb-3">🔒 Cookies essentiels (obligatoires)</h3>
                <p className="text-green-800 mb-3">
                  Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-green-700 text-sm">
                  <li><strong>Session utilisateur :</strong> Maintien de votre connexion</li>
                  <li><strong>Sécurité :</strong> Protection contre les attaques CSRF</li>
                  <li><strong>Préférences :</strong> Mémorisation de vos choix de cookies</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                <h3 className="font-bold text-blue-900 mb-3">📊 Cookies analytiques (optionnels)</h3>
                <p className="text-blue-800 mb-3">
                  Ces cookies nous aident à comprendre comment vous utilisez le site pour l'améliorer.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-blue-700 text-sm">
                  <li><strong>Pages visitées :</strong> Quelles pages sont les plus consultées</li>
                  <li><strong>Temps passé :</strong> Durée moyenne des sessions</li>
                  <li><strong>Parcours utilisateur :</strong> Navigation sur le site</li>
                  <li><strong>Données anonymisées :</strong> Aucune identification personnelle</li>
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
                <h3 className="font-bold text-purple-900 mb-3">🎯 Cookies fonctionnels (optionnels)</h3>
                <p className="text-purple-800 mb-3">
                  Ces cookies améliorent votre expérience en mémorisant vos préférences.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-purple-700 text-sm">
                  <li><strong>Langue :</strong> Mémorisation de votre langue préférée</li>
                  <li><strong>Thème :</strong> Mode clair/sombre</li>
                  <li><strong>Préférences :</strong> Paramètres personnalisés</li>
                </ul>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
                <h3 className="font-bold text-orange-900 mb-3">📢 Cookies marketing (optionnels)</h3>
                <p className="text-orange-800 mb-3">
                  Ces cookies suivent votre navigation pour afficher des publicités pertinentes.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-orange-700 text-sm">
                  <li><strong>Publicités ciblées :</strong> Annonces adaptées à vos intérêts</li>
                  <li><strong>Mesure de performance :</strong> Efficacité des campagnes</li>
                  <li><strong>Réseaux sociaux :</strong> Partage de contenu</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Cookies tiers
            </h2>
            <p className="text-gray-700 mb-4">
              Nous utilisons des services tiers qui peuvent déposer des cookies :
            </p>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-1">Google Analytics</p>
                <p className="text-gray-600 text-sm">Analyse d'audience (données anonymisées)</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-1">Stripe / Processeurs de paiement</p>
                <p className="text-gray-600 text-sm">Sécurisation des transactions</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-1">Vercel</p>
                <p className="text-gray-600 text-sm">Hébergement et performance</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Durée de conservation
            </h2>
            <div className="bg-blue-50 rounded-xl p-6">
              <ul className="space-y-2 text-blue-900">
                <li><strong>Cookies de session :</strong> Supprimés à la fermeture du navigateur</li>
                <li><strong>Cookies essentiels :</strong> Maximum 12 mois</li>
                <li><strong>Cookies analytiques :</strong> Maximum 13 mois</li>
                <li><strong>Cookies marketing :</strong> Maximum 13 mois</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Gestion des cookies
            </h2>
            
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="font-bold text-purple-900 mb-3">Via Bookzy</h3>
                <p className="text-purple-800 mb-3">
                  Vous pouvez gérer vos préférences de cookies directement sur notre site via 
                  le panneau de gestion des cookies accessible en bas de page.
                </p>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Gérer mes cookies
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">Via votre navigateur</h3>
                <p className="text-gray-700 mb-3">
                  Vous pouvez également gérer les cookies via les paramètres de votre navigateur :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm">
                  <li><strong>Chrome :</strong> Paramètres &gt; Confidentialité et sécurité &gt; Cookies</li>
                  <li><strong>Firefox :</strong> Options &gt; Vie privée et sécurité &gt; Cookies</li>
                  <li><strong>Safari :</strong> Préférences &gt; Confidentialité &gt; Cookies</li>
                  <li><strong>Edge :</strong> Paramètres &gt; Confidentialité &gt; Cookies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Conséquences du refus des cookies
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
              <p className="font-bold text-yellow-900 mb-2">⚠️ Si vous refusez les cookies :</p>
              <ul className="list-disc pl-6 space-y-2 text-yellow-800">
                <li>Certaines fonctionnalités peuvent ne pas fonctionner correctement</li>
                <li>Vous devrez vous reconnecter à chaque visite</li>
                <li>Vos préférences ne seront pas sauvegardées</li>
                <li>L'expérience utilisateur sera dégradée</li>
              </ul>
              <p className="text-yellow-700 mt-3 text-sm italic">
                Note : Les cookies essentiels ne peuvent pas être désactivés car ils sont nécessaires 
                au fonctionnement du site.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Mise à jour de cette politique
            </h2>
            <p className="text-gray-700">
              Nous pouvons mettre à jour cette politique de cookies pour refléter les changements 
              dans nos pratiques ou pour des raisons légales. La date de dernière mise à jour est 
              indiquée en haut de cette page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Contact
            </h2>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
              <p className="font-bold text-gray-900 mb-4">
                Pour toute question concernant les cookies :
              </p>
              <div className="space-y-2 text-gray-700">
                <p>📧 <strong>Email :</strong> <a href="mailto:privacy@bookzy.io" className="text-purple-600 hover:underline">privacy@bookzy.io</a></p>
                <p>💬 <strong>Support :</strong> <a href="mailto:support@bookzy.io" className="text-purple-600 hover:underline">support@bookzy.io</a></p>
                <p>🌐 <strong>Site :</strong> <a href="https://bookzy.io" className="text-purple-600 hover:underline">www.bookzy.io</a></p>
              </div>
            </div>
          </section>

        </div>

        {/* Back button */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>

      </div>
    </div>
  );
}