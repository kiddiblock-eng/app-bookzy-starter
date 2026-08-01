// /lib/ai.js
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Replicate from "replicate";
import Settings from "../models/settings";
import { dbConnect } from "./db";
import { unstable_noStore } from 'next/cache';
import { uploadBufferToCloudinary } from "./cloudinary";

/* -------------------------------------------------------
   0️⃣ Charger configuration AI depuis l'admin
------------------------------------------------------- */
export async function getAISettings() {
  unstable_noStore();
  await dbConnect();
  const settings = await Settings.findOne({ key: "global" }).lean();
  const config = settings?.ai || {};
  console.log("🧠 AI LIB LOG: Configuration NicheGenerate lue depuis la DB:");
  console.log(JSON.stringify(config.generation?.nicheGenerate, null, 2));
  return config;
}

/* -------------------------------------------------------
   1️⃣ Claude
------------------------------------------------------- */
export async function getClaudeClient() {
  const ai = await getAISettings();
  const provider = ai.providers?.claude;
  if (!provider || !provider.enabled || !provider.apiKey) {
    throw new Error("⚠️ Claude n'est pas configuré dans l'admin.");
  }
  return new Anthropic({ apiKey: provider.apiKey });
}

/* -------------------------------------------------------
   2️⃣ OpenAI
------------------------------------------------------- */
export async function getOpenAIClient() {
  const ai = await getAISettings();
  const provider = ai.providers?.openai;
  if (!provider || !provider.enabled || !provider.apiKey) {
    throw new Error("⚠️ OpenAI n'est pas configuré dans l'admin.");
  }
  return new OpenAI({ apiKey: provider.apiKey });
}

/* -------------------------------------------------------
   3️⃣ Gemini (Google)
------------------------------------------------------- */
export async function getGeminiClient() {
  const ai = await getAISettings();
  const provider = ai.providers?.gemini;
  if (!provider || !provider.enabled || !provider.apiKey) {
    throw new Error("⚠️ Gemini n'est pas configuré dans l'admin.");
  }
  return new GoogleGenerativeAI(provider.apiKey);
}

/* -------------------------------------------------------
   ✅ Replicate (Flux)
------------------------------------------------------- */
export async function getReplicateClient() {
  const ai = await getAISettings();
  const provider = ai.providers?.replicate;
  if (!provider || !provider.enabled || !provider.apiKey) {
    throw new Error("⚠️ Replicate (Flux) n'est pas configuré dans l'admin.");
  }
  return new Replicate({ auth: provider.apiKey });
}

/* -------------------------------------------------------
   4️⃣ Retourne le modèle choisi
------------------------------------------------------- */
export async function getAIModel(feature) {
  const ai = await getAISettings();
  const model = ai.generation?.[feature]?.model ||
    ai.providers?.claude?.model ||
    "claude-sonnet-4-20250514";
  console.log(`🔍 getAIModel("${feature}"):`, {
    found: ai.generation?.[feature],
    model: model
  });
  return model;
}

/* -------------------------------------------------------
   5️⃣ Provider dynamique
------------------------------------------------------- */
export async function getAIProvider(feature) {
  const ai = await getAISettings();
  const provider = ai.generation?.[feature]?.provider || "claude";
  console.log(`🔍 getAIProvider("${feature}"):`, {
    found: ai.generation?.[feature],
    provider: provider
  });
  return provider;
}

/* -------------------------------------------------------
   🔁 Fallback OpenRouter (uniquement si l'API directe plante)
   Modèle : Gemini 3 Flash via OpenRouter, avec repli sur 2.5 Flash.
------------------------------------------------------- */
async function openrouterFallbackText(prompt, maxTokens = 8000) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    console.warn("⚠️ OPENROUTER_API_KEY absente — pas de fallback possible.");
    return null;
  }
  const models = ["google/gemini-3-flash-preview", "google/gemini-3.5-flash"];
  for (const model of models) {
    try {
      console.log(`🔁 Fallback OpenRouter: essai avec ${model}...`);
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://bookzy.app",
          "X-Title": "Bookzy",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
      });
      if (!res.ok) {
        console.warn(`⚠️ OpenRouter ${model} → ${res.status}: ${await res.text().catch(() => "")}`);
        continue;
      }
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (text && text.trim()) {
        console.log(`✅ Fallback OpenRouter réussi (${model})`);
        return text;
      }
    } catch (e) {
      console.warn(`⚠️ Fallback OpenRouter ${model}:`, e.message);
    }
  }
  return null;
}

/* -------------------------------------------------------
   6️⃣ Appel universel IA pour texte
------------------------------------------------------- */
export async function getAIText(feature, prompt, maxTokens = 8000) {
  const provider = await getAIProvider(feature);
  const model = await getAIModel(feature);

  console.log(`🤖 getAIText("${feature}"): Utilisation de ${provider} avec le modèle ${model}`);

  if (provider === "claude") {
    const client = await getClaudeClient();
    const msg = await client.messages.create({
      model,
      max_tokens: maxTokens,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });
    return msg.content?.[0]?.text || "";
  }

  if (provider === "openai") {
    const client = await getOpenAIClient();
    const msg = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.7,
    });
    return msg.choices?.[0]?.message?.content || "";
  }

  if (provider === "gemini") {
    // 1️⃣ ESSAI SUR TON API GEMINI DIRECTE (comportement inchangé, chaîne de modèles)
    try {
      const client = await getGeminiClient();

      const fallbackChain = [
        model,
        "gemini-3-flash-preview",
        "gemini-3.1-flash-lite-preview",
        "gemini-3.1-pro-preview",
      ]
        .filter((m) => m && !m.includes("2.5"))       // on n'utilise plus aucun Gemini 2.5
        .filter((m, i, arr) => arr.indexOf(m) === i); // déduplique

      const safetySettings = [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ];

      for (const fallbackModel of fallbackChain) {
        try {
          console.log(`🤖 Gemini (direct): essai avec ${fallbackModel}...`);
          const genModel = client.getGenerativeModel({ model: fallbackModel });
          const result = await genModel.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            safetySettings,
          });
          const text = result.response.text();
          if (text && text.trim()) {
            console.log(`✅ Gemini (direct): succès avec ${fallbackModel}`);
            return text;
          }
        } catch (err) {
          const isFatal = err.status === 404 ||
            err.message?.includes("404") ||
            err.message?.includes("no longer available");
          const isHighDemand = err.message?.includes("overloaded") ||
            err.message?.includes("high demand") ||
            err.message?.includes("503") ||
            err.status === 503;

          if ((isFatal || isHighDemand) && fallbackChain.indexOf(fallbackModel) < fallbackChain.length - 1) {
            console.warn(`⚠️ Gemini ${fallbackModel} indispo — modèle suivant...`);
            continue;
          }
          throw err; // erreur non récupérable → on sort vers le fallback OpenRouter
        }
      }
      console.warn("⚠️ Tous les modèles Gemini directs sont surchargés.");
    } catch (geminiErr) {
      console.warn("⚠️ API Gemini directe en échec:", geminiErr.message);
    }

    // 2️⃣ FALLBACK OPENROUTER (seulement si le direct a planté / tout surchargé)
    const orText = await openrouterFallbackText(prompt, maxTokens);
    if (orText) return orText;

    console.error("❌ Gemini direct ET fallback OpenRouter ont échoué.");
    return null;
  }

  throw new Error("❌ Provider IA inconnu : " + provider);
}

/* -------------------------------------------------------
   7️⃣ Génération d'images avec IA
------------------------------------------------------- */
export async function getAIImage(feature, prompt, size = "1024x1024") {
  const provider = await getAIProvider(feature);
  const ai = await getAISettings();

  console.log(`🎨 getAIImage("${feature}"): Provider = ${provider}`);

  // ✅ FLUX (REPLICATE)
  if (provider === "replicate") {
    try {
      const client = await getReplicateClient();
      const imageModel = ai.generation?.[feature]?.model ||
        ai.providers?.replicate?.imageModel ||
        "black-forest-labs/flux-schnell";

      console.log(`⚡ Génération image avec Flux: ${imageModel}`);

      const output = await client.run(imageModel, {
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: "3:4",
          output_format: "png",
          output_quality: 90,
        }
      });

      const imageUrl = Array.isArray(output) ? output[0] : output;
      if (imageUrl) {
        console.log(`✅ Image Flux générée: ${imageUrl}`);
        return imageUrl;
      }
      console.warn("⚠️ Aucune URL retournée par Flux");
      return null;
    } catch (error) {
      console.error("❌ Erreur génération image Flux:", error.message);
      return null;
    }
  }

  // ✅ GEMINI
  if (provider === "gemini") {
    try {
      const client = await getGeminiClient();
      const imageModel = ai.generation?.[feature]?.imageModel || "gemini-2.0-flash-exp";

      console.log(`🎨 Génération image avec Gemini modèle: ${imageModel}`);

      const genModel = client.getGenerativeModel({ model: imageModel });
      const result = await genModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, topK: 40, topP: 0.95 }
      });

      const response = result.response;
      const candidates = response.candidates || [];

      if (candidates.length > 0) {
        const parts = candidates[0]?.content?.parts || [];
        const imagePart = parts.find(part => part.inlineData?.mimeType?.startsWith('image/'));

        if (imagePart?.inlineData) {
          const base64Data = imagePart.inlineData.data;
          const mimeType = imagePart.inlineData.mimeType;

          console.log(`📸 Image Gemini générée (${mimeType}), upload sur Cloudinary...`);

          try {
            const buffer = Buffer.from(base64Data, 'base64');
            const extension = mimeType.split('/')[1] || 'png';
            const upload = await uploadBufferToCloudinary(buffer, {
              folder: "bookzy/ai-images",
              resourceType: "image",
              extension: extension
            });
            console.log(`✅ Image Gemini uploadée: ${upload.secure_url}`);
            return upload.secure_url;
          } catch (uploadError) {
            console.error("❌ Erreur upload Cloudinary:", uploadError.message);
            const imageUrl = `data:${mimeType};base64,${base64Data}`;
            console.warn("⚠️ Utilisation data URL en fallback");
            return imageUrl;
          }
        }
      }

      console.warn("⚠️ Aucune image retournée par Gemini");
      return null;
    } catch (error) {
      console.error("❌ Erreur génération image Gemini:", error);
      return null;
    }
  }

  // ✅ OPENAI DALL-E
  if (provider === "openai") {
    try {
      const client = await getOpenAIClient();
      const imageModel = ai.generation?.[feature]?.imageModel || "dall-e-3";

      const response = await client.images.generate({
        model: imageModel,
        prompt: prompt,
        n: 1,
        size: size,
        quality: "standard",
      });

      const imageUrl = response.data[0]?.url;
      if (imageUrl) {
        console.log(`✅ Image générée via OpenAI ${imageModel}: ${imageUrl}`);
        return imageUrl;
      }
      console.warn("⚠️ Aucune URL retournée par OpenAI");
      return null;
    } catch (error) {
      console.error("❌ Erreur génération image OpenAI:", error.message);
      return null;
    }
  }

  console.warn(`⚠️ ${provider} ne supporte pas la génération d'images.`);
  return null;
}

/* -------------------------------------------------------
   8️⃣ Liste des modèles disponibles par provider
------------------------------------------------------- */
export const AVAILABLE_MODELS = {
  claude: {
    text: [
      { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4 (Recommended)" },
      { id: "claude-sonnet-4-5-20250929", name: "Claude Sonnet 4.5" },
      { id: "claude-opus-4-20250514", name: "Claude Opus 4" },
      { id: "claude-3.5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
    ]
  },
  openai: {
    text: [
      { id: "gpt-4o", name: "GPT-4o (Recommended)" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    ],
    image: [
      { id: "dall-e-3", name: "DALL-E 3" },
      { id: "dall-e-2", name: "DALL-E 2" },
    ]
  },
  gemini: {
    text: [
      { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro Preview (Latest)" },
      { id: "gemini-3.1-flash-lite-preview", name: "Gemini 3.1 Flash Lite Preview (Fast)" },
      { id: "gemini-3-flash-preview", name: "Gemini 3 Flash Preview (Recommended)" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
    ],
    image: [
      { id: "gemini-3-pro-image-preview", name: "Gemini 3 Pro Preview (Studio Image)" },
      { id: "gemini-3.1-flash-image-preview", name: "Gemini 3.1 Flash Image Preview (FREE)" },
    ]
  },
  replicate: {
    image: [
      { id: "black-forest-labs/flux-schnell", name: "Flux Schnell (Ultra Fast - Recommended)" },
      { id: "black-forest-labs/flux-dev", name: "Flux Dev (High Quality)" },
      { id: "black-forest-labs/flux-pro", name: "Flux Pro (Maximum Quality)" },
    ]
  }
};