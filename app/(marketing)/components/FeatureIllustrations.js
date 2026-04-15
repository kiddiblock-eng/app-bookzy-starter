// Illustrations animées pour les feature cards

export function IllustrationGeneration() {
  return (
    <div style={{ width: '100%', aspectRatio: '4/3', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @keyframes typing { 0%,100%{width:0} 50%{width:100%} }
        @keyframes fadeUp { 0%{opacity:0;transform:translateY(8px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse-dot { 0%,100%{transform:scale(1)} 50%{transform:scale(1.4)} }
      `}</style>
      <div style={{ width: 280, padding: '16px', background: 'white', borderRadius: 14, boxShadow: '0 4px 24px rgba(37,99,235,0.1)', border: '1px solid #BFDBFE' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' }}>Génération en cours</div>
        {[
          { w: '85%', delay: '0s', color: '#1e3a8a' },
          { w: '70%', delay: '0.3s', color: '#1e3a8a' },
          { w: '90%', delay: '0.6s', color: '#1e3a8a' },
          { w: '60%', delay: '0.9s', color: '#1e3a8a' },
        ].map((line, i) => (
          <div key={i} style={{ height: 8, borderRadius: 4, background: '#DBEAFE', marginBottom: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: line.w, background: '#3b82f6', borderRadius: 4, animation: `typing 2s ${line.delay} infinite ease-in-out` }} />
          </div>
        ))}
        <div style={{ marginTop: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
          {[0, 0.15, 0.3].map((d, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: `pulse-dot 1s ${d}s infinite` }} />
          ))}
          <span style={{ fontSize: 11, color: '#93c5fd', marginLeft: 4 }}>Rédaction du chapitre 2...</span>
        </div>
      </div>
    </div>
  );
}

export function IllustrationDesigner() {
  return (
    <div style={{ width: '100%', aspectRatio: '4/3', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @keyframes slide-in { 0%{transform:translateX(-20px);opacity:0} 100%{transform:translateX(0);opacity:1} }
        @keyframes transform-doc { 0%,40%{transform:scale(1)} 60%,100%{transform:scale(0.95) translateX(10px)} }
        @keyframes appear-pro { 0%,40%{opacity:0;transform:scale(0.9)} 70%,100%{opacity:1;transform:scale(1)} }
        @keyframes arrow-bounce { 0%,100%{transform:translateX(0)} 50%{transform:translateX(4px)} }
      `}</style>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 100, background: 'white', borderRadius: 8, padding: '10px 8px', border: '1px solid #A7F3D0', animation: 'transform-doc 3s infinite' }}>
          <div style={{ fontSize: 8, color: '#6b7280', marginBottom: 6 }}>document.docx</div>
          {[90, 70, 85, 60, 75].map((w, i) => (
            <div key={i} style={{ height: 4, borderRadius: 2, background: '#e5e7eb', width: `${w}%`, marginBottom: 4 }} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, animation: 'arrow-bounce 1s infinite' }}>
          {['→', '→', '→'].map((a, i) => (
            <span key={i} style={{ fontSize: 14, color: '#059669', fontWeight: 700 }}>{a}</span>
          ))}
        </div>
        <div style={{ width: 110, background: '#059669', borderRadius: 8, padding: '10px 8px', animation: 'appear-pro 3s infinite' }}>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>ebook_pro.pdf</div>
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.5)', width: '90%', marginBottom: 4 }} />
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.3)', width: '70%', marginBottom: 4 }} />
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.5)', width: '85%', marginBottom: 4 }} />
          <div style={{ height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.2)', width: '100%', marginTop: 8 }} />
        </div>
      </div>
    </div>
  );
}

export function IllustrationRomans() {
  return (
    <div style={{ width: '100%', aspectRatio: '4/3', background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <style>{`
        @keyframes page-turn { 0%,100%{transform:rotateY(0deg)} 50%{transform:rotateY(-20deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes write-line { 0%{width:0} 100%{width:100%} }
      `}</style>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
        {['Thriller', 'Romance', 'Fantasy'].map((genre, i) => (
          <div key={i} style={{ width: 70, height: i === 1 ? 110 : 90, background: ['#be185d','#e11d48','#9f1239'][i], borderRadius: '2px 6px 6px 2px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '8px 6px', animation: `float 2s ${i * 0.4}s infinite ease-in-out`, boxShadow: '2px 4px 12px rgba(0,0,0,0.15)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'rgba(0,0,0,0.2)' }} />
            <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: 1 }}>{genre}</div>
            {[60, 80, 50].map((w, j) => (
              <div key={j} style={{ height: 3, borderRadius: 1, background: 'rgba(255,255,255,0.3)', width: `${w}%`, marginTop: 3 }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function IllustrationYoubook() {
  return (
    <div style={{ width: '100%', aspectRatio: '4/3', background: 'linear-gradient(135deg, #FFF5F5 0%, #FEE2E2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <style>{`
        @keyframes yt-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        @keyframes convert { 0%,30%{opacity:1} 50%,100%{opacity:0} }
        @keyframes appear-ebook { 0%,40%{opacity:0;transform:scale(0.8)} 70%,100%{opacity:1;transform:scale(1)} }
        @keyframes move-arrow { 0%{transform:translateX(0);opacity:0.3} 100%{transform:translateX(6px);opacity:1} }
      `}</style>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{ width: 110, background: '#111', borderRadius: 8, overflow: 'hidden', animation: 'yt-pulse 2s infinite' }}>
          <div style={{ height: 65, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '12px solid white', marginLeft: 2 }} />
            </div>
          </div>
          <div style={{ padding: '6px 8px' }}>
            <div style={{ height: 4, borderRadius: 2, background: '#333', width: '90%', marginBottom: 4 }} />
            <div style={{ height: 4, borderRadius: 2, background: '#333', width: '60%' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[0, 0.2, 0.4].map((d, i) => (
            <div key={i} style={{ fontSize: 16, color: '#ef4444', fontWeight: 700, animation: `move-arrow 0.6s ${d}s infinite alternate` }}>→</div>
          ))}
        </div>
        <div style={{ width: 90, background: '#ef4444', borderRadius: '2px 8px 8px 2px', padding: '12px 8px', animation: 'appear-ebook 3s infinite', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'rgba(0,0,0,0.2)' }} />
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>ebook.pdf</div>
          {[85, 65, 80, 55, 70].map((w, i) => (
            <div key={i} style={{ height: 3, borderRadius: 1, background: 'rgba(255,255,255,0.4)', width: `${w}%`, marginBottom: 4 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function IllustrationRadar() {
  return (
    <div style={{ width: '100%', aspectRatio: '4/3', background: 'linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <style>{`
        @keyframes radar-spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes ping { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2);opacity:0} }
        @keyframes dot-appear { 0%,100%{opacity:0} 50%{opacity:1} }
      `}</style>
      <div style={{ position: 'relative', width: 160, height: 160 }}>
        {[1,0.66,0.33].map((scale, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, margin: `${i * 26}px`, borderRadius: '50%', border: '1px solid rgba(8,145,178,0.3)', background: i === 2 ? 'rgba(8,145,178,0.05)' : 'transparent' }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'radar-spin 3s linear infinite', transformOrigin: 'center' }}>
          <div style={{ position: 'absolute', width: '50%', height: 1, background: 'linear-gradient(90deg, transparent, #0891b2)', right: '50%', top: '50%', transformOrigin: 'right center' }} />
        </div>
        {[[30, 40], [100, 60], [60, 110], [120, 100]].map(([x, y], i) => (
          <div key={i} style={{ position: 'absolute', left: x, top: y }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0891b2', animation: `ping 2s ${i * 0.5}s infinite` }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0891b2', position: 'absolute', top: 0 }} />
          </div>
        ))}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0e7490' }} />
        </div>
      </div>
    </div>
  );
}

export function IllustrationNiche() {
  return (
    <div style={{ width: '100%', aspectRatio: '4/3', background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <style>{`
        @keyframes bar-grow { 0%{height:0} 100%{height:var(--h)} }
        @keyframes score-count { 0%{opacity:0} 100%{opacity:1} }
      `}</style>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 100 }}>
          {[
            { h: 60, label: 'CI', color: '#f59e0b' },
            { h: 85, label: 'SN', color: '#d97706' },
            { h: 45, label: 'CM', color: '#f59e0b' },
            { h: 75, label: 'BJ', color: '#d97706' },
            { h: 55, label: 'TG', color: '#f59e0b' },
          ].map((bar, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 24, height: bar.h, background: bar.color, borderRadius: '4px 4px 0 0', animation: `bar-grow 1s ${i * 0.15}s both`, '--h': `${bar.h}px` }} />
              <span style={{ fontSize: 8, color: '#92400e', fontWeight: 700 }}>{bar.label}</span>
            </div>
          ))}
        </div>
        <div style={{ background: 'white', borderRadius: 10, padding: '10px 12px', border: '1px solid #FDE68A', minWidth: 80 }}>
          <div style={{ fontSize: 8, color: '#92400e', marginBottom: 4 }}>Score</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#d97706', lineHeight: 1 }}>87</div>
          <div style={{ fontSize: 8, color: '#92400e' }}>/100</div>
          <div style={{ marginTop: 6, height: 4, borderRadius: 2, background: '#FEF3C7' }}>
            <div style={{ height: '100%', width: '87%', background: '#f59e0b', borderRadius: 2 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function IllustrationValidateur() {
  return (
    <div style={{ width: '100%', aspectRatio: '4/3', background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <style>{`
        @keyframes progress-fill { 0%{width:0} 100%{width:82%} }
        @keyframes check-appear { 0%{opacity:0;transform:scale(0)} 100%{opacity:1;transform:scale(1)} }
        @keyframes count-up { 0%{opacity:0} 100%{opacity:1} }
      `}</style>
      <div style={{ background: 'white', borderRadius: 14, padding: '16px', width: 240, border: '1px solid #DDD6FE', boxShadow: '0 4px 20px rgba(139,92,246,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4c1d95' }}>Rapport d'analyse</div>
          <div style={{ fontSize: 9, color: '#7c3aed', background: '#F5F3FF', padding: '2px 6px', borderRadius: 4 }}>IA + Data</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ position: 'relative', width: 52, height: 52 }}>
            <svg viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="26" cy="26" r="22" fill="none" stroke="#EDE9FE" strokeWidth="5"/>
              <circle cx="26" cy="26" r="22" fill="none" stroke="#7c3aed" strokeWidth="5" strokeDasharray="138" strokeDashoffset="25" strokeLinecap="round"/>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#4c1d95' }}>82</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#6d28d9', fontWeight: 700 }}>Très rentable</div>
            <div style={{ fontSize: 9, color: '#a78bfa' }}>Score /100</div>
          </div>
        </div>
        {[
          { label: 'Demande', val: '92%', color: '#7c3aed' },
          { label: 'Concurrence', val: 'Faible', color: '#059669' },
          { label: 'Revenus est.', val: '180k FCFA', color: '#7c3aed' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: i < 2 ? '1px solid #F5F3FF' : 'none' }}>
            <span style={{ fontSize: 10, color: '#6b7280' }}>{item.label}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: item.color }}>{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}