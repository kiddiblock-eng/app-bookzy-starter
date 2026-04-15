"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, FileUp, Check, X, ArrowRight } from "lucide-react";

const DetailsModal = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;
  const content = {
    editor: {
      title: "Écrire mon contenu",
      color: "#0f172a",
      features: ["Éditeur riche (gras, titres, listes)","IA intégrée (améliorer, corriger)","10 améliorations IA incluses","Copier-coller depuis Word","Aperçu en temps réel","12 templates professionnels"]
    },
    import: {
      title: "Importer depuis Word",
      color: "#0f172a",
      features: ["Import .docx automatique","Détection des chapitres intelligente","Ajustement manuel du sommaire","Génération ultra-rapide","Documents structurés supportés","Choix du template après import"]
    }
  };
  const data = content[type];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
      <div style={{background:"white",borderRadius:"16px",width:"100%",maxWidth:"400px",overflow:"hidden",boxShadow:"0 24px 48px rgba(0,0,0,0.15)"}}>
        <div style={{padding:"28px 28px 0"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"24px"}}>
            <h2 style={{fontSize:"17px",fontWeight:"700",color:"#0f172a",margin:0}}>{data.title}</h2>
            <button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"8px",background:"#f1f5f9",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <X size={14} color="#64748b" />
            </button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"12px",marginBottom:"28px"}}>
            {data.features.map((f,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:"12px"}}>
                <Check size={13} color="#0f172a" strokeWidth={2.5} />
                <span style={{fontSize:"13px",color:"#475569"}}>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{padding:"0 28px 28px"}}>
          <button onClick={onClose} style={{width:"100%",padding:"12px",background:"#4f46e5",color:"white",fontWeight:"600",fontSize:"13px",border:"none",borderRadius:"10px",cursor:"pointer"}}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ExpressHome() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  return (
    <>
      <DetailsModal isOpen={showModal} onClose={() => setShowModal(false)} type={modalType} />

      <div style={{minHeight:"100vh",background:"white"}}>
        <div style={{maxWidth:"780px",margin:"0 auto",padding:"64px 24px"}}>

          {/* Header */}
          <div style={{marginBottom:"56px"}}>
            <p style={{fontSize:"11px",fontWeight:"700",letterSpacing:"2px",color:"#94a3b8",textTransform:"uppercase",margin:"0 0 12px"}}>Studio de création</p>
            <h1 style={{fontSize:"clamp(28px,4vw,40px)",fontWeight:"800",color:"#0f172a",margin:"0 0 12px",letterSpacing:"-0.5px",lineHeight:1.15}}>Ebook Designer</h1>
            <p style={{fontSize:"15px",color:"#64748b",margin:0,maxWidth:"440px",lineHeight:1.6}}>
              Transformez vos textes et fichiers Word en PDF professionnels en quelques secondes.
            </p>
          </div>

          {/* Options */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"16px",marginBottom:"48px"}}>

            {/* Écrire */}
            <div style={{background:"white",borderRadius:"14px",border:"1px solid #e2e8f0",overflow:"hidden",transition:"box-shadow 0.15s"}}>
              <div style={{padding:"28px"}}>
                <div style={{width:"40px",height:"40px",borderRadius:"10px",background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"20px"}}>
                  <Pencil size={18} color="#0f172a" strokeWidth={1.5} />
                </div>
                <h2 style={{fontSize:"16px",fontWeight:"700",color:"#0f172a",margin:"0 0 6px"}}>Écrire mon contenu</h2>
                <p style={{fontSize:"13px",color:"#94a3b8",margin:"0 0 20px",lineHeight:1.5}}>Rédigez avec l'éditeur enrichi et l'assistance IA</p>
                <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"24px"}}>
                  {["10 améliorations IA incluses","Éditeur riche complet","12 templates professionnels"].map((f,i) => (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:"8px"}}>
                      <div style={{width:"4px",height:"4px",borderRadius:"50%",background:"#cbd5e1",flexShrink:0}} />
                      <span style={{fontSize:"12px",color:"#64748b"}}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:"8px"}}>
                  <Link href="/dashboard/express/editor" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",padding:"11px 16px",background:"#4f46e5",color:"white",fontWeight:"600",fontSize:"13px",borderRadius:"9px",textDecoration:"none"}}>
                    Commencer <ArrowRight size={13} />
                  </Link>
                  <button onClick={() => { setModalType("editor"); setShowModal(true); }} style={{padding:"11px 14px",borderRadius:"9px",background:"#f8fafc",border:"1px solid #e2e8f0",cursor:"pointer",fontSize:"12px",color:"#64748b",fontWeight:"500"}}>
                    Détails
                  </button>
                </div>
              </div>
            </div>

            {/* Importer */}
            <div style={{background:"white",borderRadius:"14px",border:"1px solid #e2e8f0",overflow:"hidden"}}>
              <div style={{padding:"28px"}}>
                <div style={{width:"40px",height:"40px",borderRadius:"10px",background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"20px"}}>
                  <FileUp size={18} color="#0f172a" strokeWidth={1.5} />
                </div>
                <h2 style={{fontSize:"16px",fontWeight:"700",color:"#0f172a",margin:"0 0 6px"}}>Importer depuis Word</h2>
                <p style={{fontSize:"13px",color:"#94a3b8",margin:"0 0 20px",lineHeight:1.5}}>Uploadez votre .docx et obtenez un ebook mis en page</p>
                <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"24px"}}>
                  {["Détection chapitres automatique","Ajustement manuel du sommaire","Mise en page instantanée"].map((f,i) => (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:"8px"}}>
                      <div style={{width:"4px",height:"4px",borderRadius:"50%",background:"#cbd5e1",flexShrink:0}} />
                      <span style={{fontSize:"12px",color:"#64748b"}}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:"8px"}}>
                  <Link href="/dashboard/express/import" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",padding:"11px 16px",background:"#4f46e5",color:"white",fontWeight:"600",fontSize:"13px",borderRadius:"9px",textDecoration:"none"}}>
                    Importer <ArrowRight size={13} />
                  </Link>
                  <button onClick={() => { setModalType("import"); setShowModal(true); }} style={{padding:"11px 14px",borderRadius:"9px",background:"#f8fafc",border:"1px solid #e2e8f0",cursor:"pointer",fontSize:"12px",color:"#64748b",fontWeight:"500"}}>
                    Détails
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Stats */}
          <div style={{borderTop:"1px solid #e2e8f0",paddingTop:"32px",display:"flex",gap:"40px",flexWrap:"wrap"}}>
            {[
              {label:"Temps de génération",value:"~20 secondes"},
              {label:"Templates disponibles",value:"12 designs"},
              {label:"Format de sortie",value:"PDF A4"},
            ].map((s,i) => (
              <div key={i}>
                <div style={{fontSize:"11px",color:"#94a3b8",fontWeight:"600",marginBottom:"4px",textTransform:"uppercase",letterSpacing:"0.5px"}}>{s.label}</div>
                <div style={{fontSize:"15px",color:"#0f172a",fontWeight:"700"}}>{s.value}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}