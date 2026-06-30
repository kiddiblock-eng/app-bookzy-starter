import { NextResponse } from "next/server";
import { isAllowedCloudinaryUrl } from "@/lib/safeFetchUrl";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("URL manquante", { status: 400 });
  }

  // 🛡️ Anti-SSRF : seules les URLs Cloudinary sont proxifiables
  if (!isAllowedCloudinaryUrl(url)) {
    return new NextResponse("URL non autorisée", { status: 400 });
  }

  try {
    console.log(`📥 [Proxy-PDF] Récupération: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`✅ [Proxy-PDF] PDF récupéré (${buffer.length} bytes)`);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=apercu.pdf",
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("❌ [Proxy-PDF] Erreur:", error);
    return new NextResponse("Erreur de chargement du PDF", { status: 500 });
  }
}