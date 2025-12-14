// app/(legal)/refund/page.jsx

import Link from "next/link";

export const metadata = {
  title: "Politique de Remboursement | Bookzy",
  description: "Conditions de remboursement sur Bookzy"
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 md:p-12 mb-8 shadow-lg">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Politique de Remboursement
          </h1>
          <p className="text-gray-600">
            Dernière mise à jour : 26 novembre 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Principe général
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Bookzy s'engage à fournir un service de qualité. Si vous n'êtes pas satisfait, 
              nous proposons des remboursements sous certaines conditions détaillées ci-dessous.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Tarification
            </h2>
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-blue-900 font-bold mb-2">
                💰 Prix par génération : 2 000 FCFA
              </p>
              <p className="text-blue-800 text-sm">
                Chaque génération complète (ebook + couverture 3D + 2 affiches + textes marketing) 
                coûte 2 000 FCFA. Le paiement est effectué avant la génération du contenu.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Conditions de remboursement
            </h2>
            
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
                <p className="font-bold text-green-900 mb-3">✓ Vous pouvez demander un remboursement si :</p>
                <ul className="list-disc pl-6 space-y-2 text-green-800">
                  <li>La génération a échoué et vous n'avez reçu AUCUN fichier</li>
                  <li>Vous avez été facturé deux fois pour la même génération (erreur système)</li>
                  <li>La demande est faite dans les 24 heures suivant le paiement</li>
                  <li>Vous rencontrez un problème technique majeur empêchant la génération</li>
                  <li>Les fichiers générés sont corrompus ou impossibles à ouvrir</li>
                </ul>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                <p className="font-bold text-red-900 mb-3">✗ Aucun remboursement n'est possible si :</p>
                <ul className="list-disc pl-6 space-y-2 text-red-800">
                  <li>La génération a réussi et vous avez reçu tous les fichiers</li>
                  <li>Vous êtes insatisfait de la qualité ou du style du contenu généré (subjectif)</li>
                  <li>Vous avez changé d'avis après avoir téléchargé les fichiers</li>
                  <li>La demande est faite après le délai de 24 heures</li>
                  <li>Vous avez violé nos Conditions Générales d'Utilisation</li>
                  <li>Votre compte a été suspendu pour non-respect des règles</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Délais et procédure
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <p className="text-4xl font-black text-blue-600 mb-2">24h</p>
                <p className="text-blue-900 text-sm font-semibold">Délai pour demander</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 text-center">
                <p className="text-4xl font-black text-purple-600 mb-2">48h</p>
                <p className="text-purple-900 text-sm font-semibold">Réponse de notre équipe</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <p className="text-4xl font-black text-green-600 mb-2">5-10 jours</p>
                <p className="text-green-900 text-sm font-semibold">Remboursement effectif</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Comment demander un remboursement :</h3>
              <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                <li>
                  <strong>Contactez notre support</strong> à{" "}
                  <a href="mailto:support@bookzy.io" className="text-purple-600 hover:underline">
                    support@bookzy.io
                  </a>
                </li>
                <li><strong>Indiquez votre numéro de transaction</strong> et la date de paiement</li>
                <li><strong>Décrivez le problème rencontré</strong> (génération échouée, fichiers corrompus, etc.)</li>
                <li><strong>Fournissez des preuves</strong> si possible (captures d'écran, messages d'erreur)</li>
                <li><strong>Attendez notre réponse</strong> sous 48h maximum</li>
                <li><strong>Recevez votre remboursement</strong> par le même moyen de paiement utilisé</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Montant du remboursement
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>• Remboursement intégral (2 000 FCFA) :</strong> Si la génération a totalement échoué</p>
              <p><strong>• Double paiement :</strong> Remboursement automatique de la transaction en double</p>
              <p><strong>• Frais de transaction :</strong> Les frais de paiement mobile (si applicables) ne sont pas remboursables</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Cas spécifiques
            </h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold text-blue-900 mb-3">📄 Fichiers corrompus ou impossibles à ouvrir</h3>
                <p className="text-blue-800 mb-3">
                  Si les fichiers générés sont corrompus :
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-blue-700 text-sm">
                  <li>Contactez-nous immédiatement avec captures d'écran de l'erreur</li>
                  <li>Nous vérifierons les fichiers de notre côté</li>
                  <li>Si confirmé, nous relancerons la génération GRATUITEMENT</li>
                  <li>Si le problème persiste, remboursement intégral</li>
                </ol>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="font-bold text-purple-900 mb-3">⚠️ Génération incomplète</h3>
                <p className="text-purple-800 mb-3">
                  Si vous avez reçu seulement une partie des fichiers (ex: ebook mais pas de couverture) :
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-purple-700 text-sm">
                  <li>Contactez support@bookzy.io avec les détails</li>
                  <li>Nous générerons les fichiers manquants GRATUITEMENT</li>
                  <li>Aucun remboursement si tous les fichiers sont finalement fournis</li>
                </ol>
              </div>

              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="font-bold text-orange-900 mb-3">🔄 Erreur de paiement</h3>
                <p className="text-orange-800 mb-3">
                  Si votre compte a été débité mais aucune génération n'a été lancée :
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-orange-700 text-sm">
                  <li>Vérifiez votre historique de transactions dans votre compte</li>
                  <li>Si aucune génération ne correspond, contactez-nous</li>
                  <li>Remboursement automatique sous 48h après vérification</li>
                </ol>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Moyens de remboursement
            </h2>
            <p className="text-gray-700 mb-4">
              Le remboursement est effectué par le même moyen de paiement utilisé lors de l'achat :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-1">💳 Carte bancaire</p>
                <p className="text-gray-600 text-sm">Remboursement sur votre carte sous 5-10 jours ouvrés</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-1">📱 Mobile Money</p>
                <p className="text-gray-600 text-sm">Remboursement sur votre compte sous 3-5 jours (Orange Money, Wave, etc.)</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Exceptions (Pas de remboursement)
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
              <p className="font-bold text-yellow-900 mb-2">⚠️ Pas de remboursement dans ces cas :</p>
              <ul className="list-disc pl-6 space-y-2 text-yellow-800">
                <li><strong>Qualité subjective :</strong> Vous n'aimez pas le style, le ton ou le design généré</li>
                <li><strong>Changement d'avis :</strong> Vous ne voulez plus de l'ebook après l'avoir téléchargé</li>
                <li><strong>Erreur de votre part :</strong> Vous avez fait une faute dans le titre ou la description</li>
                <li><strong>Alternative trouvée :</strong> Vous avez trouvé une autre solution ailleurs</li>
                <li><strong>Fichiers téléchargés :</strong> Vous avez déjà téléchargé tous les fichiers avec succès</li>
                <li><strong>Délai dépassé :</strong> Demande faite après 24 heures</li>
                <li><strong>Compte banni :</strong> Violation des CGU</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Garantie de satisfaction
            </h2>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <p className="font-bold text-green-900 mb-3">
                🎯 Notre engagement qualité
              </p>
              <p className="text-green-800 mb-3">
                Nous sommes confiants dans la qualité de notre service. Si la génération échoue 
                techniquement et que vous respectez les conditions ci-dessus, nous vous rembourserons 
                ou relancerons la génération gratuitement.
              </p>
              <p className="text-green-700 text-sm italic">
                Notre objectif est votre satisfaction. Si un problème technique empêche la génération, 
                nous le résolvons ou remboursons.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Alternative au remboursement
            </h2>
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <p className="font-bold text-purple-900 mb-3">
                🔄 Relance de génération gratuite
              </p>
              <p className="text-purple-800 mb-3">
                Dans la plupart des cas, au lieu d'un remboursement, nous proposons de relancer 
                la génération gratuitement. Cela vous permet d'obtenir votre contenu sans attendre 
                le délai de remboursement.
              </p>
              <p className="text-purple-700 text-sm">
                Cette option est disponible pour : fichiers corrompus, génération incomplète, 
                erreurs techniques.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Litiges
            </h2>
            <p className="text-gray-700">
              En cas de désaccord concernant un remboursement, vous pouvez escalader votre demande à{" "}
              <a href="mailto:legal@bookzy.io" className="text-purple-600 hover:underline font-semibold">
                legal@bookzy.io
              </a>. Nous nous engageons à traiter chaque cas de manière juste et transparente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Contact
            </h2>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
              <p className="font-bold text-gray-900 mb-4">
                Pour toute demande de remboursement :
              </p>
              <div className="space-y-2 text-gray-700">
                <p>📧 <strong>Email prioritaire :</strong> <a href="mailto:support@bookzy.io" className="text-purple-600 hover:underline">support@bookzy.io</a></p>
                <p>⚖️ <strong>Litiges :</strong> <a href="mailto:legal@bookzy.io" className="text-purple-600 hover:underline">legal@bookzy.io</a></p>
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