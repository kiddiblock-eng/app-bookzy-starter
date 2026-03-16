import User from "@/models/User";
import Commission from "@/models/Commission";

// 💰 CONFIGURATION
const COMMISSION_RATE = 0.10; // 10% du montant payé

/**
 * Génère un code parrain unique basé sur le prénom
 * Ex: Jean -> "JEAN-4K2"
 */
export async function createAffiliateCode(firstName) {
  let isUnique = false;
  let code = "";

  // Nettoyage du prénom (MAJUSCULE, sans espace)
  const baseName = firstName 
    ? firstName.trim().toUpperCase().replace(/[^A-Z]/g, "").substring(0, 4) 
    : "USER";

  while (!isUnique) {
    // Génère 3 caractères aléatoires (Chiffres + Lettres)
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    code = `${baseName}-${randomSuffix}`;

    // Vérifie si ce code existe déjà en base
    const existingUser = await User.findOne({ affiliateCode: code });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return code;
}

/**
 * Traite la commission après un achat réussi
 * @param {String} buyerId - L'ID de l'utilisateur qui vient d'acheter
 * @param {Number} amountPaid - Le montant payé (ex: 2000)
 */
export async function processCommission(buyerId, amountPaid) {
  try {
    // 1. Trouver l'acheteur et voir s'il a un parrain
    const buyer = await User.findById(buyerId);
    
    if (!buyer || !buyer.referredBy) {
      console.log("🚫 Pas de parrain pour cet achat. Aucune commission.");
      return;
    }

    const parrainId = buyer.referredBy;

    // 2. Calculer la commission (Ici c'est fixe à 600, mais modifiable)
    const commissionAmount = Math.round(amountPaid * COMMISSION_RATE);

    // 3. Créer l'historique de commission (Preuve)
    const newCommission = await Commission.create({
      affiliateId: parrainId,
      referredUserId: buyerId,
      amount: commissionAmount,
      sourceAmount: amountPaid,
      status: "VALIDATED",
      description: `Commission 10% sur achat de ${amountPaid} FCFA`
    });

    // 4. Mettre à jour le portefeuille du Parrain
    await User.findByIdAndUpdate(parrainId, {
      $inc: { 
        "wallet.balance": commissionAmount,      // Ajoute au solde dispo
        "wallet.totalEarned": commissionAmount   // Ajoute au total gagné à vie
      }
    });

    console.log(`✅ Commission de ${commissionAmount} FCFA versée au parrain ${parrainId}`);
    return newCommission;

  } catch (error) {
    console.error("❌ Erreur lors du traitement de la commission:", error);
    // On ne bloque pas l'achat si l'affiliation plante, on log juste l'erreur
  }
}