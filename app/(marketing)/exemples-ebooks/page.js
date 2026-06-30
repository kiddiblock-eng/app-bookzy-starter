"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Eye, X } from "lucide-react";

// ── DATA ──────────────────────────────────────────────────────────────────────

const TEMPLATES = {
  business: {
    bg: "linear-gradient(135deg,#0f172a,#1e293b)",
    accent: "#d4af37",
    badge: "PREMIUM",
    badgeStyle: "border border-yellow-500/60 text-yellow-400",
    titleColor: "#d4af37",
    pattern: "gold",
    label: "Business",
  },
  educatif: {
    bg: "linear-gradient(135deg,#0f766e,#14b8a6)",
    accent: "#14b8a6",
    badge: "FORMATION",
    badgeStyle: "bg-white/20 text-white",
    titleColor: "#ffffff",
    pattern: "dots",
    label: "Éducatif",
  },
  wellness: {
    bg: "linear-gradient(135deg,#f3e8ff,#c4b5fd)",
    accent: "#8b5cf6",
    badge: "🌸 BIEN-ÊTRE",
    badgeStyle: "bg-purple-200/60 text-purple-800",
    titleColor: "#581c87",
    pattern: "soft",
    label: "Wellness",
  },
  nature: {
    bg: "linear-gradient(135deg,#166534,#15803d)",
    accent: "#4ade80",
    badge: "🌱 NATURE",
    badgeStyle: "bg-white/20 text-white",
    titleColor: "#ffffff",
    pattern: "leaves",
    label: "Nature",
  },
  fashion: {
    bg: "linear-gradient(135deg,#9f1239,#be185d)",
    accent: "#fb7185",
    badge: "STYLE",
    badgeStyle: "border border-white text-white",
    titleColor: "#ffffff",
    pattern: "frame",
    label: "Fashion",
  },
  afrique: {
    bg: "linear-gradient(135deg,#78350f,#b45309,#d97706)",
    accent: "#fbbf24",
    badge: "🌍 AFRIQUE",
    badgeStyle: "bg-white/20 text-white",
    titleColor: "#ffffff",
    pattern: "kente",
    label: "Afrique",
  },
  sport: {
    bg: "linear-gradient(135deg,#0f172a,#1e293b)",
    accent: "#ef4444",
    badge: "⚡ SPORT",
    badgeStyle: "bg-red-500 text-white",
    titleColor: "#ffffff",
    pattern: "diagonal",
    label: "Sport",
  },
  tech: {
    bg: "linear-gradient(135deg,#0a0e27,#1e3a8a)",
    accent: "#00d4ff",
    badge: "TECH",
    badgeStyle: "border border-cyan-400 text-cyan-400",
    titleColor: "#67e8f9",
    pattern: "code",
    label: "Tech",
  },
};

const EBOOKS = [
  {
    id: 1,
    title: "Maîtriser WhatsApp Business",
    niche: "Marketing Digital",
    template: "business",
    time: 62,
    price: 4900,
    currency: "FCFA",
    pdf: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773188104/bookzy/ebooks/maitriser-whatsapp-business-69b0b393370bdef7d6198af1.pdf",
    previewId: "maitriser-whatsapp-business-69b0b393370bdef7d6198af1",
    pages: 44,
  },
  {
    id: 2,
    title: "L'art de l'oratoire — Parler en public avec charisme",
    niche: "Développement Personnel",
    template: "educatif",
    time: 68,
    price: 2900,
    currency: "FCFA",
    pdf: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773432969/bookzy/ebooks/lart-de-loratoire-parler-en-public-avec-charisme-et-assurance-69b47016391523fc07.pdf",
    previewId: "lart-de-loratoire-parler-en-public-avec-charisme-et-assurance-69b47016391523fc07",
    pages: 30,
  },
  {
    id: 3,
    title: "Le business des jus naturels — Bissap, Gingembre",
    niche: "Entrepreneuriat",
    template: "wellness",
    time: 65,
    price: 2900,
    currency: "FCFA",
    pdf: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773195421/bookzy/ebooks/le-business-des-jus-naturels-packaging-bissap-gingembre-69b0cee8370bdef7d6199168.pdf",
    previewId: "le-business-des-jus-naturels-packaging-bissap-gingembre-69b0cee8370bdef7d6199168",
    pages: 46,
  },
  {
    id: 4,
    title: "Réussir sa relation à distance",
    niche: "Lifestyle & Couple",
    template: "fashion",
    time: 60,
    price: 3900,
    currency: "FCFA",
    pdf: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773187763/bookzy/ebooks/reussir-sa-relation-a-distance-69b0b254370bdef7d6198a45.pdf",
    previewId: "reussir-sa-relation-a-distance-69b0b254370bdef7d6198a45",
    pages: 44,
  },
  {
    id: 5,
    title: "Intelligence artificielle pour débutants — Guide 2026",
    niche: "Technologie",
    template: "tech",
    time: 61,
    price: 4900,
    currency: "FCFA",
    pdf: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773189314/bookzy/ebooks/intelligence-artificielle-pour-debutants-guide-2026-69b0b858370bdef7d6198cba.pdf",
    previewId: "intelligence-artificielle-pour-debutants-guide-2026-69b0b858370bdef7d6198cba",
    pages: 43,
  },
  {
    id: 6,
    title: "Trouver sa vocation — Le plan divin pour votre vie",
    niche: "Spiritualité",
    template: "nature",
    time: 69,
    price: 2900,
    currency: "FCFA",
    pdf: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773194603/bookzy/ebooks/trouver-sa-vocation-le-plan-divin-pour-votre-vie-69b0ccd7370bdef7d61990b1.pdf",
    previewId: "trouver-sa-vocation-le-plan-divin-pour-votre-vie-69b0ccd7370bdef7d61990b1",
    pages: 40,
  },
  {
    id: 7,
    title: "Construire sa villa sans risques",
    niche: "Immobilier",
    template: "afrique",
    time: 64,
    price: 6900,
    currency: "FCFA",
    pdf: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773193667/bookzy/ebooks/immo-pays-construire-sa-villa-sans-risques-69b0c93c370bdef7d6198fad.pdf",
    previewId: "immo-pays-construire-sa-villa-sans-risques-69b0c93c370bdef7d6198fad",
    pages: 46,
  },
  {
    id: 8,
    title: "Musculation à la maison — Programme complet sans matériel",
    niche: "Fitness",
    template: "sport",
    time: 66,
    price: 3900,
    currency: "FCFA",
    pdf: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773188410/bookzy/ebooks/musculation-a-la-maison-le-programme-complet-sans-materiel-69b0b4c7370bdef7d6198.pdf",
    previewId: "musculation-a-la-maison-le-programme-complet-sans-materiel-69b0b4c7370bdef7d6198",
    pages: 41,
  },
];

// ── PATTERNS SVG ─────────────────────────────────────────────────────────────
function Pattern({ type, accent }) {
  switch (type) {
    case "gold":
      return <div style={{ position:"absolute",left:0,top:0,bottom:0,width:"3px",background:`linear-gradient(180deg,${accent},transparent)` }} />;
    case "dots":
      return <div style={{ position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,.18) 1px,transparent 1px)",backgroundSize:"8px 8px" }} />;
    case "soft":
      return <div style={{ position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 70% 30%,rgba(139,92,246,.4),transparent 60%)" }} />;
    case "kente":
      return <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"5px",background:"repeating-linear-gradient(90deg,#d97706 0,#d97706 8px,#dc2626 8px,#dc2626 16px,white 16px,white 24px)" }} />;
    case "diagonal":
      return <div style={{ position:"absolute",inset:0,background:"repeating-linear-gradient(-45deg,transparent,transparent 8px,rgba(239,68,68,.1) 8px,rgba(239,68,68,.1) 9px)" }} />;
    case "code":
      return <div style={{ position:"absolute",bottom:"8px",left:"8px",right:"8px",height:"2px",background:`linear-gradient(90deg,${accent},transparent)` }} />;
    case "frame":
      return <div style={{ position:"absolute",inset:"6px",border:"1px solid rgba(255,255,255,.2)",pointerEvents:"none" }} />;
    default:
      return null;
  }
}

// ── BOOK COVER ────────────────────────────────────────────────────────────────
function BookCover({ ebook, size = "md" }) {
  const tmpl = TEMPLATES[ebook.template];
  const w = size === "lg" ? 160 : size === "sm" ? 80 : 120;
  const h = Math.round(w * 1.4);
  const titleSize = size === "lg" ? 13 : size === "sm" ? 8 : 10;
  const badgeSize = size === "lg" ? 9 : size === "sm" ? 6 : 7;

  return (
    <div style={{
      position: "relative",
      width: w,
      height: h,
      borderRadius: size === "lg" ? 10 : 6,
      overflow: "hidden",
      background: tmpl.bg,
      flexShrink: 0,
      boxShadow: "8px 8px 24px rgba(0,0,0,0.3), 2px 2px 8px rgba(0,0,0,0.2)",
    }}>
      <Pattern type={tmpl.pattern} accent={tmpl.accent} />
      {/* Spine shadow */}
      <div style={{ position:"absolute",left:0,top:0,bottom:0,width:"3px",background:"rgba(0,0,0,0.25)" }} />
      {/* Content */}
      <div style={{ position:"relative",zIndex:1,padding:size==="sm"?"6px":"10px",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between" }}>
        <span style={{
          display:"inline-block",
          padding:`${badgeSize/2}px ${badgeSize}px`,
          borderRadius:3,
          fontSize:badgeSize,
          fontWeight:800,
          letterSpacing:"0.08em",
          ...(tmpl.badgeStyle.includes("border") ? {
            border:`1px solid ${tmpl.accent}`,
            color: tmpl.accent,
          } : {
            background:"rgba(255,255,255,0.2)",
            color:"white",
          }),
          alignSelf:"flex-start",
          lineHeight:1.2,
        }}>
          {tmpl.badge}
        </span>
        <p style={{
          margin:0,
          color: tmpl.titleColor,
          fontSize: titleSize,
          fontWeight:800,
          lineHeight:1.3,
          letterSpacing:"-0.02em",
        }}>
          {ebook.title}
        </p>
      </div>
      {/* Pages effect */}
      <div style={{ position:"absolute",top:2,right:-3,bottom:2,width:3,background:"white",borderRadius:"0 2px 2px 0",zIndex:-1 }} />
      <div style={{ position:"absolute",top:4,right:-5,bottom:4,width:2,background:"#e2e8f0",borderRadius:"0 2px 2px 0",zIndex:-2 }} />
    </div>
  );
}

// ── PDF VIEWER MODAL — Google Docs Viewer ────────────────────────────────────
function PDFModal({ ebook, onClose }) {
  const [loading, setLoading] = useState(true);
  if (!ebook) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative z-10 bg-white w-full h-full sm:w-[90%] sm:h-[90%] sm:max-w-4xl sm:rounded-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 flex-shrink-0">
          <div>
            <h3 className="font-bold text-neutral-900 text-sm sm:text-base">{ebook.title}</h3>
            <p className="text-xs text-neutral-400">Template {TEMPLATES[ebook.template].label} · Généré par Bookzy</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>
        <div className="flex-1 bg-neutral-50 relative">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-50 z-10">
              <div className="w-10 h-10 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mb-3" />
              <p className="text-neutral-500 text-sm">Chargement du PDF...</p>
            </div>
          )}
          <iframe
            src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(ebook.pdf)}`}
            className="w-full h-full border-0"
            title={ebook.title}
            onLoad={() => setLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}


// ── EBOOK CARD ────────────────────────────────────────────────────────────────
function EbookCard({ ebook, index, onPreview }) {
  const tmpl = TEMPLATES[ebook.template];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#fafafa" : "#ffffff",
        border: `1px solid ${hovered ? "#d4d4d4" : "#e5e5e5"}`,
        borderRadius: 16,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        transition: "all 0.2s ease",
        cursor: "default",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/* Top row */}
      <div style={{ display:"flex",gap:18,alignItems:"flex-start" }}>
        <BookCover ebook={ebook} size="md" />
        <div style={{ flex:1,minWidth:0 }}>
          {/* Numéro + template badge */}
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
            <span style={{ fontFamily:"monospace",fontSize:10,color:"#a3a3a3",fontWeight:700 }}>
              #{String(index + 1).padStart(2,"0")}
            </span>
            <span style={{
              padding:"2px 8px",
              background:"#f5f5f5",
              border:"1px solid #e5e5e5",
              borderRadius:100,
              fontSize:9,
              fontWeight:700,
              letterSpacing:"0.1em",
              textTransform:"uppercase",
              color:"#525252",
            }}>
              {tmpl.label}
            </span>
          </div>

          <h3 style={{ margin:"0 0 6px",color:"#171717",fontWeight:800,fontSize:15,lineHeight:1.3,letterSpacing:"-0.3px" }}>
            {ebook.title}
          </h3>
          <p style={{ margin:"0 0 14px",color:"#737373",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em" }}>
            {ebook.niche}
          </p>

          {/* Métriques */}
          <div style={{ display:"flex",gap:16 }}>
            <div style={{ display:"flex",alignItems:"center",gap:5 }}>
              <Clock size={11} color="#059669" />
              <span style={{ fontSize:11,color:"#525252",fontWeight:600 }}>{ebook.time}s</span>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:5 }}>
              <Eye size={11} color="#059669" />
              <span style={{ fontSize:11,color:"#525252",fontWeight:600 }}>{ebook.pages} pages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height:1,background:"#e5e5e5" }} />

      {/* Bottom row */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div>
          <p style={{ margin:"0 0 2px",color:"#a3a3a3",fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em" }}>
            Valeur marché
          </p>
          <p style={{ margin:0,color:"#059669",fontWeight:900,fontSize:18,letterSpacing:"-0.5px" }}>
            {ebook.price.toLocaleString()} <span style={{ fontSize:11,fontWeight:600,color:"#737373" }}>{ebook.currency}</span>
          </p>
        </div>
        <button
          onClick={() => onPreview(ebook)}
          style={{
            display:"flex",
            alignItems:"center",
            gap:6,
            padding:"9px 16px",
            background: hovered ? "#262626" : "#171717",
            border:"1px solid #171717",
            borderRadius:8,
            color:"#ffffff",
            fontSize:12,
            fontWeight:700,
            cursor:"pointer",
            transition:"all 0.15s",
            letterSpacing:"0.02em",
          }}
        >
          <Eye size={13} /> Voir l'ebook
        </button>
      </div>
    </div>
  );
}

// ── PAGE PRINCIPALE ───────────────────────────────────────────────────────────
export default function EbooksVitrinePage() {
  const [previewEbook, setPreviewEbook] = useState(null);

  const totalValue = EBOOKS.reduce((acc, e) => acc + e.price, 0);
  const avgTime = Math.round(EBOOKS.reduce((acc, e) => acc + e.time, 0) / EBOOKS.length);

  return (
    <div style={{ minHeight:"100vh",background:"#ffffff",overflowX:"hidden",fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* ── HEADER ── */}
      <header style={{ borderBottom:"1px solid #e5e5e5",padding:"0 24px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",height:60,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <Link href="/" style={{ textDecoration:"none",fontWeight:900,fontSize:20,color:"#171717",letterSpacing:"-0.5px" }}>
            Bookzy<span style={{ color:"#059669" }}>.</span>
          </Link>
          <Link
            href="/auth/register"
            style={{
              display:"flex",alignItems:"center",gap:6,
              padding:"9px 20px",
              background:"#171717",
              borderRadius:8,
              color:"#FFFFFF",
              fontWeight:800,
              fontSize:12,
              textDecoration:"none",
              letterSpacing:"0.05em",
              textTransform:"uppercase",
            }}
          >
            Créer mon ebook <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ maxWidth:1100,margin:"0 auto",padding:"80px 24px 60px",textAlign:"center" }}>
        <div style={{
          display:"inline-block",
          background:"#FFFFFF",
          border:"1px solid #e5e5e5",
          borderRadius:100,
          padding:"6px 18px",
          fontSize:10,
          fontWeight:700,
          letterSpacing:"0.2em",
          textTransform:"uppercase",
          color:"#8A8070",
          marginBottom:28,
        }}>
          Générés avec Bookzy · 100% réels
        </div>

        <h1 style={{ margin:"0 0 20px",color:"#171717",fontWeight:900,fontSize:"clamp(32px,6vw,60px)",lineHeight:1.05,letterSpacing:"-2px" }}>
          {EBOOKS.length} ebooks créés.<br />
          <span style={{ color:"#059669" }}>En moins de 70 secondes.</span>
        </h1>
        <p style={{ margin:"0 auto",maxWidth:500,color:"#6B6460",fontSize:16,lineHeight:1.7 }}>
          Chaque ebook ci-dessous a été généré par l'IA de Bookzy en 64s : contenu, mise en page. Aucun template externe. Aucune retouche. Et chaque ebook est accompagné d'un kit marketing complet.
        </p>

        {/* Stats */}
        <div style={{ display:"flex",justifyContent:"center",gap:0,marginTop:48,borderTop:"1px solid #e5e5e5",borderBottom:"1px solid #e5e5e5",padding:"28px 0" }}>
          {[
            { value: EBOOKS.length, label: "Ebooks générés" },
            { value: `${avgTime}s`, label: "Temps moyen" },
        
            { value: "16", label: "Templates disponibles" },
          ].map((stat, i) => (
            <div key={i} style={{ flex:1,textAlign:"center",borderRight:i<3?"1px solid #e5e5e5":"none",padding:"0 24px" }}>
              <p style={{ margin:"0 0 6px",fontWeight:900,fontSize:"clamp(20px,3vw,30px)",color:"#171717",letterSpacing:"-1px" }}>{stat.value}</p>
              <p style={{ margin:0,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.15em",color:"#A09080" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── GRID EBOOKS ── */}
      <section style={{ maxWidth:1100,margin:"0 auto",padding:"0 24px 80px" }}>
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))",
          gap:16,
        }}>
          {EBOOKS.map((ebook, i) => (
            <EbookCard key={ebook.id} ebook={ebook} index={i} onPreview={setPreviewEbook} />
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ borderTop:"1px solid #e5e5e5",background:"#fafafa" }}>
        <div style={{ maxWidth:600,margin:"0 auto",padding:"72px 24px",textAlign:"center" }}>
          <p style={{ margin:"0 0 12px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.2em",color:"#A09080" }}>
            Ton tour
          </p>
          <h2 style={{ margin:"0 0 16px",color:"#171717",fontWeight:900,fontSize:"clamp(24px,4vw,38px)",letterSpacing:"-1px",lineHeight:1.1 }}>
            Crée ton ebook en<br /><span style={{ color:"#059669" }}>moins d'une minute.</span>
          </h2>
          <p style={{ margin:"0 0 36px",color:"#6B6460",fontSize:15,lineHeight:1.6 }}>
            Choisis ta niche, ton template, et laisse l'IA générer un ebook professionnel prêt à vendre.
          </p>
          <Link
            href="/auth/register"
            style={{
              display:"inline-flex",alignItems:"center",gap:8,
              padding:"16px 36px",
              background:"#171717",
              borderRadius:10,
              color:"#FFFFFF",
              fontWeight:900,
              fontSize:13,
              textDecoration:"none",
              letterSpacing:"0.05em",
              textTransform:"uppercase",
            }}
          >
            Générer mon ebook  <ArrowRight size={15} />
          </Link>
          <p style={{ margin:"16px 0 0",fontSize:11,color:"#A09080" }}>
            Pas de carte bancaire · Premiers crédits offerts
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:"1px solid #e5e5e5",padding:"24px",textAlign:"center" }}>
        <p style={{ margin:0,fontSize:11,color:"#e5e5e5",fontWeight:600 }}>
          © {new Date().getFullYear()} Bookzy · Tous droits réservés
        </p>
      </footer>

      {/* ── PDF MODAL ── */}
      {previewEbook && (
        <PDFModal ebook={previewEbook} onClose={() => setPreviewEbook(null)} />
      )}
    </div>
  );
}