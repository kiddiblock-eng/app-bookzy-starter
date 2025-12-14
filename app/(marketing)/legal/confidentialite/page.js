// app/(legal)/privacy/page.jsx

import Link from "next/link";

export const metadata = {
  title: "Politique de Confidentialité | Bookzy",
  description: "Comment Bookzy protège vos données personnelles"
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 md:p-12 mb-8 shadow-lg">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-gray-600">
            Dernière mise à jour : 26 novembre 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Bookzy (ci-après nous, notre ou nos) s'engage à protéger la confidentialité 
              de vos données personnelles. Cette politique explique comment nous collectons, 
              utilisons, stockons et protégeons vos informations conformément au Règlement Général 
              sur la Protection des Données (RGPD).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Responsable du traitement
            </h2>
            <div className="bg-gray-50 rounded-xl p-6 text-gray-700 space-y-2">
              <p><strong>Nom de l'entreprise :</strong> Blinko </p>
              <p><strong>Adresse :</strong> 675 E 140TH ST APT 3CC BRONX, NY 10454</p>
              <p><strong>Email :</strong> privacy@bookzy.io</p>

            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Données collectées
            </h2>
            <p className="text-gray-700 mb-4">
              Nous collectons les données suivantes :
            </p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">3.1. Données d'identification</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Mot de passe (crypté)</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">3.2. Données de paiement</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Informations de paiement mobile (via nos processeurs de paiement sécurisés)</li>
                  <li>Historique des transactions</li>
                  <li>Montants payés</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2 italic">
                  Note : Nous ne stockons JAMAIS vos données bancaires complètes. 
                  Le paiement est géré par des processeurs certifiés PCI-DSS.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">3.3. Données de création de contenu</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Titres et descriptions d'ebooks créés</li>
                  <li>Choix de templates et styles</li>
                  <li>Fichiers générés (ebooks, couvertures, affiches)</li>
                  <li>Historique de génération</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">3.4. Données techniques</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Adresse IP</li>
                  <li>Type de navigateur et appareil</li>
                  <li>Système d'exploitation</li>
                  <li>Pages visitées et temps passé</li>
                  <li>Cookies et identifiants de session</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Finalités du traitement
            </h2>
            <p className="text-gray-700 mb-4">
              Nous utilisons vos données pour les finalités suivantes :
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Fourniture du service</p>
                  <p className="text-gray-600 text-sm">Création d'ebooks, génération de visuels, gestion de votre compte</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Traitement des paiements</p>
                  <p className="text-gray-600 text-sm">Facturation, remboursements, prévention de la fraude</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Communication</p>
                  <p className="text-gray-600 text-sm">Emails de confirmation, notifications importantes, support client</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Amélioration du service</p>
                  <p className="text-gray-600 text-sm">Analyse d'utilisation, correction de bugs, développement de nouvelles fonctionnalités</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Marketing (avec consentement)</p>
                  <p className="text-gray-600 text-sm">Newsletter, offres promotionnelles (vous pouvez vous désabonner à tout moment)</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Base légale du traitement
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>• Exécution du contrat :</strong> Traitement nécessaire pour fournir nos services</p>
              <p><strong>• Consentement :</strong> Pour les communications marketing et les cookies non essentiels</p>
              <p><strong>• Intérêt légitime :</strong> Amélioration du service, sécurité, prévention de la fraude</p>
              <p><strong>• Obligation légale :</strong> Conservation des données de facturation, lutte contre la fraude</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Partage des données
            </h2>
            <p className="text-gray-700 mb-4">
              Nous ne vendons JAMAIS vos données. Nous les partageons uniquement avec :
            </p>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-1">Processeurs de paiement</p>
                <p className="text-gray-600 text-sm">Pour traiter vos transactions (ex: Stripe, Wave, Orange Money)</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-1">Fournisseurs d'infrastructure</p>
                <p className="text-gray-600 text-sm">Hébergement sécurisé </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-1">Outils d'analyse</p>
                <p className="text-gray-600 text-sm">Pour améliorer nos services (données anonymisées)</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-1">Autorités légales</p>
                <p className="text-gray-600 text-sm">Si requis par la loi ou pour protéger nos droits</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Durée de conservation
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
              <ul className="space-y-2 text-gray-700">
                <li><strong>Compte actif :</strong> Tant que votre compte existe</li>
                <li><strong>Après suppression du compte :</strong> 30 jours (puis suppression complète)</li>
                <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
                <li><strong>Cookies :</strong> Maximum 13 mois</li>
                <li><strong>Logs techniques :</strong> 12 mois maximum</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Sécurité des données
            </h2>
            <p className="text-gray-700 mb-4">
              Nous mettons en œuvre des mesures de sécurité strictes :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="font-semibold text-green-900 mb-1">🔒 Cryptage SSL/TLS</p>
                <p className="text-green-700 text-sm">Toutes les communications sont cryptées</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="font-semibold text-green-900 mb-1">🔐 Mots de passe cryptés</p>
                <p className="text-green-700 text-sm">Avec algorithme bcrypt</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="font-semibold text-green-900 mb-1">🛡️ Pare-feu et monitoring</p>
                <p className="text-green-700 text-sm">Protection contre les attaques</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="font-semibold text-green-900 mb-1">💾 Sauvegardes régulières</p>
                <p className="text-green-700 text-sm">Données sauvegardées quotidiennement</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Vos droits (RGPD)
            </h2>
            <p className="text-gray-700 mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <p className="font-bold text-gray-900">✓ Droit d'accès</p>
                <p className="text-gray-600 text-sm">Obtenir une copie de vos données</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-bold text-gray-900">✓ Droit de rectification</p>
                <p className="text-gray-600 text-sm">Corriger vos données inexactes</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <p className="font-bold text-gray-900">✓ Droit à l'effacement</p>
                <p className="text-gray-600 text-sm">Supprimer vos données (droit à l'oubli)</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="font-bold text-gray-900">✓ Droit à la portabilité</p>
                <p className="text-gray-600 text-sm">Récupérer vos données dans un format lisible</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <p className="font-bold text-gray-900">✓ Droit d'opposition</p>
                <p className="text-gray-600 text-sm">Vous opposer au traitement de vos données</p>
              </div>
            </div>
            
            <div className="mt-6 bg-purple-50 rounded-xl p-6">
              <p className="font-bold text-purple-900 mb-2">
                Comment exercer vos droits ?
              </p>
              <p className="text-purple-700 mb-3">
                Contactez-nous à <a href="mailto:privacy@bookzy.io" className="underline font-semibold">privacy@bookzy.io</a>
              </p>
              <p className="text-purple-600 text-sm">
                Nous répondrons dans un délai maximum de 30 jours.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Cookies
            </h2>
            <p className="text-gray-700 mb-3">
              Nous utilisons des cookies pour améliorer votre expérience. 
              Pour plus d'informations, consultez notre{" "}
              <Link href="/cookies" className="text-purple-600 hover:underline font-semibold">
                Politique des Cookies
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Mineurs
            </h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
              <p className="text-red-900 font-bold mb-2">
                ⚠️ Service réservé aux adultes
              </p>
              <p className="text-red-700">
                Bookzy est destiné aux personnes de 18 ans et plus. Nous ne collectons pas 
                sciemment de données auprès de mineurs.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Contact
            </h2>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
              <p className="font-bold text-gray-900 mb-4">
                Pour toute question concernant cette politique :
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