import Notification from "@/models/Notification";

/**
 * Créer une notification d'eBook prêt
 */
export async function createEbookReadyNotification(userId, { ebookId, ebookTitle, fileUrl }) {
  try {
    const notification = await Notification.create({
      userId,
      type: "ebook_ready",
      title: "Votre eBook est prêt ! ✨",
      message: `"${ebookTitle}" a été généré avec succès et est disponible au téléchargement.`,
      icon: "sparkles",
      color: "purple",
      link: `/dashboard/fichiers/${ebookId}`,
      metadata: {
        ebookId,
        ebookTitle,
        fileUrl
      }
    });
    return notification;
  } catch (error) {
    console.error("❌ Erreur création notification eBook:", error);
    throw error;
  }
}

/**
 * Créer une notification d'achat réussi
 */
export async function createPurchaseNotification(userId, { productName, amount, transactionId }) {
  try {
    const notification = await Notification.create({
      userId,
      type: "purchase",
      title: "Achat réussi ! 🎉",
      message: `Votre achat de "${productName}" (${amount}€) a été confirmé.`,
      icon: "check-circle",
      color: "green",
      link: `/dashboard/achats/${transactionId}`,
      metadata: {
        productName,
        amount,
        transactionId
      }
    });
    return notification;
  } catch (error) {
    console.error("❌ Erreur création notification achat:", error);
    throw error;
  }
}

/**
 * Créer une notification système
 */
export async function createSystemNotification(userId, { title, message, icon = "info", color = "blue", link = null }) {
  try {
    const notification = await Notification.create({
      userId,
      type: "system",
      title,
      message,
      icon,
      color,
      link
    });
    return notification;
  } catch (error) {
    console.error("❌ Erreur création notification système:", error);
    throw error;
  }
}