import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    // 🗂️ Chemin vers ton dossier utils/templates
    const filePath = path.join(process.cwd(), "app/utils/templates", `${id}.json`);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Erreur chargement du template :", error);
    return NextResponse.json(
      { success: false, message: "Template introuvable", error: error.message },
      { status: 404 }
    );
  }
}
