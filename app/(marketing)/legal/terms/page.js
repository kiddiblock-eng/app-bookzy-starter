// app/legal/terms/page.jsx

import Link from "next/link";

export const metadata = {
  title: "Conditions Générales d'Utilisation | Bookzy",
  description: "Conditions d'utilisation de la plateforme Bookzy"
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 md:p-12 mb-8 shadow-lg">
          {/* Logo Bookzy */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-lg bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20 transition-transform group-hover:scale-105">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                Bookzy
              </span>
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 text-center">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-gray-600 text-center">
            Dernière mise à jour : 26 novembre 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Acceptation des conditions
            </h2>
            <p className="text-gray-700 leading-relaxed">
              En accédant et en utilisant Bookzy (ci-après le Service), vous acceptez d'être lié 
              par les présentes Conditions Générales d'Utilisation (CGU). Si vous n'acceptez pas 
              ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Description du service
            </h2>
            <p className="text-gray-700 mb-4">
              Bookzy est une plateforme de création automatisée de contenus numériques qui permet aux utilisateurs de :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Générer des ebooks professionnels via intelligence artificielle</li>
              <li>Créer des couvertures 3D et visuels marketing</li>
              <li>Obtenir des affiches publicitaires optimisées</li>
              <li>Recevoir des textes marketing et descriptions de vente</li>
              <li>Accéder à des outils d'analyse de niches rentables</li>
              <li>Consulter les tendances du moment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Inscription et compte utilisateur
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">3.1. Création de compte</h3>
                <p className="text-gray-700">
                  Pour utiliser Bookzy, vous devez créer un compte en fournissant des informations 
                  exactes et complètes. Vous êtes responsable de maintenir la confidentialité de 
                  vos identifiants.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">3.2. Conditions d'âge</h3>
                <p className="text-gray-700">
                  Vous devez avoir au moins 18 ans pour utiliser Bookzy. En créant un compte, 
                  vous certifiez avoir l'âge légal requis.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">3.3. Sécurité du compte</h3>
                <p className="text-gray-700">
                  Vous êtes responsable de toutes les activités effectuées depuis votre compte. 
                  En cas d'utilisation non autorisée, contactez-nous immédiatement à support@bookzy.io.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Utilisation du service
            </h2>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl mb-4">
              <p className="font-bold text-green-900 mb-2">✓ Utilisations autorisées</p>
              <ul className="list-disc pl-6 space-y-1 text-green-800">
                <li>Créer des ebooks pour usage commercial ou personnel</li>
                <li>Télécharger et utiliser les fichiers générés</li>
                <li>Vendre les produits créés sur des plateformes tierces</li>
                <li>Modifier et personnaliser les contenus générés</li>
              </ul>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
              <p className="font-bold text-red-900 mb-2">✗ Utilisations interdites</p>
              <ul className="list-disc pl-6 space-y-1 text-red-800">
                <li>Revendre ou redistribuer l'accès au service Bookzy</li>
                <li>Utiliser le service pour créer du contenu illégal, diffamatoire ou offensant</li>
                <li>Tenter de contourner les limitations techniques du service</li>
                <li>Utiliser des bots ou scripts automatisés sans autorisation</li>
                <li>Partager votre compte avec d'autres utilisateurs</li>
                <li>Copier, modifier ou distribuer le code source de la plateforme</li>
                <li>Créer du contenu violant les droits d'auteur de tiers</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Propriété intellectuelle
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">5.1. Contenu généré</h3>
                <p className="text-gray-700 text-sm">
                  Vous conservez tous les droits sur le contenu que vous créez via Bookzy. 
                  Vous pouvez utiliser, modifier, vendre et distribuer librement les ebooks, 
                  couvertures et visuels générés.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">5.2. Plateforme Bookzy</h3>
                <p className="text-gray-700 text-sm">
                  Tous les droits sur la plateforme Bookzy, son code, son design, ses algorithmes 
                  et sa marque restent la propriété exclusive de Bookzy. Vous ne pouvez pas 
                  copier, modifier ou créer des œuvres dérivées de la plateforme.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">5.3. Licence d'utilisation</h3>
                <p className="text-gray-700 text-sm">
                  Bookzy vous accorde une licence non exclusive, non transférable et révocable 
                  pour utiliser le service conformément aux présentes CGU.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Paiements et tarification
            </h2>
            
            <div className="space-y-3 text-gray-700">
              <p><strong>6.1. Prix :</strong> Les prix sont affichés en FCFA et sont susceptibles de modifications. Les prix en vigueur au moment de votre achat s'appliquent.</p>
              <p><strong>6.2. Méthodes de paiement :</strong> Nous acceptons les paiements via carte bancaire, mobile money (Orange Money, Wave, etc.) et autres moyens de paiement disponibles sur la plateforme.</p>
              <p><strong>6.3. Facturation :</strong> Vous recevez une facture par email après chaque transaction. Ces factures sont conservées dans votre compte.</p>
              <p><strong>6.4. Crédits :</strong> Les crédits achetés ne sont pas remboursables et n'ont pas de date d'expiration tant que votre compte est actif.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Politique de remboursement
            </h2>
            <p className="text-gray-700 mb-3">
              Pour les détails complets sur notre politique de remboursement, consultez notre{" "}
              <Link href="/legal/refund" className="text-slate-900 hover:underline font-semibold">
                Politique de Remboursement
              </Link>.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-900 text-sm">
                <strong>Résumé :</strong> Les remboursements sont possibles dans les 24 heures suivant 
                l'achat si vous n'avez pas utilisé les crédits. Contactez support@bookzy.io pour 
                toute demande.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Garanties et limitations
            </h2>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="font-bold text-yellow-900 mb-2">⚠️ Service fourni en l'état</p>
                <p className="text-yellow-800 text-sm">
                  Bookzy est fourni en l'état sans garantie d'aucune sorte. Nous ne garantissons pas 
                  que le service sera ininterrompu, sans erreur ou exempt de virus.
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="font-bold text-yellow-900 mb-2">⚠️ Qualité du contenu généré</p>
                <p className="text-yellow-800 text-sm">
                  Bien que nous nous efforcions de produire du contenu de haute qualité, nous ne 
                  garantissons pas que le contenu généré sera exempt d'erreurs ou répondra à vos 
                  attentes spécifiques. Il est de votre responsabilité de vérifier et modifier 
                  le contenu avant utilisation.
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="font-bold text-yellow-900 mb-2">⚠️ Limitation de responsabilité</p>
                <p className="text-yellow-800 text-sm">
                  Bookzy ne peut être tenu responsable des dommages indirects, accessoires ou 
                  consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser le service. 
                  Notre responsabilité totale est limitée au montant que vous avez payé pour le service.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Résiliation
            </h2>
            
            <div className="space-y-3 text-gray-700">
              <p><strong>9.1. Par vous :</strong> Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre compte.</p>
              <p><strong>9.2. Par nous :</strong> Nous pouvons suspendre ou résilier votre compte si vous violez les présentes CGU, sans remboursement des crédits non utilisés.</p>
              <p><strong>9.3. Effet de la résiliation :</strong> Après résiliation, vous perdez l'accès au service. Vos fichiers générés restent disponibles pendant 30 jours pour téléchargement.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Modifications du service et des CGU
            </h2>
            <p className="text-gray-700 mb-3">
              Nous nous réservons le droit de modifier le service et les présentes CGU à tout moment. 
              Les modifications importantes seront notifiées par email. L'utilisation continue du 
              service après notification vaut acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Protection des données
            </h2>
            <p className="text-gray-700 mb-3">
              L'utilisation de vos données personnelles est régie par notre{" "}
              <Link href="/legal/confidentialite" className="text-slate-900 hover:underline font-semibold">
                Politique de Confidentialité
              </Link>, qui fait partie intégrante des présentes CGU.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Loi applicable et juridiction
            </h2>
            <p className="text-gray-700">
              Les présentes CGU sont régies par les lois en vigueur. Tout litige sera soumis 
              à la compétence exclusive des tribunaux compétents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Contact
            </h2>
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-200">
              <p className="font-bold text-gray-900 mb-4">
                Pour toute question concernant ces conditions :
              </p>
              <div className="space-y-2 text-gray-700">
                <p>📧 <strong>Email :</strong> <a href="mailto:legal@bookzy.io" className="text-slate-900 hover:underline">legal@bookzy.io</a></p>
                <p>💬 <strong>Support :</strong> <a href="mailto:support@bookzy.io" className="text-slate-900 hover:underline">support@bookzy.io</a></p>
                <p>🌐 <strong>Site :</strong> <a href="https://bookzy.io" className="text-slate-900 hover:underline">www.bookzy.io</a></p>
              </div>
            </div>
          </section>

        </div>

        {/* Back button */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-900 hover:text-slate-700 font-semibold transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>

      </div>
    </div>
  );
}