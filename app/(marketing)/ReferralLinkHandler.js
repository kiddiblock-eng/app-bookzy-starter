// app/(marketing)/ReferralLinkHandler.jsx
"use client";

import { useEffect } from 'react';

export default function ReferralLinkHandler() {
  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      
      // Intercepter les liens vers inscription/connexion
      if (href && (
        href.includes('/auth/register') || 
        href.includes('/auth/login') ||
        href.includes('/api/auth/google')
      )) {
        e.preventDefault();
        
        // Lire le cookie bookzy_ref
        const refCode = document.cookie
          .split('; ')
          .find(row => row.startsWith('bookzy_ref='))
          ?.split('=')[1];
        
        // Ajouter ?ref=XXX si présent
        const finalUrl = refCode && !href.includes('?ref=')
          ? `${href}${href.includes('?') ? '&' : '?'}ref=${refCode}`
          : href;
        
        console.log('🔗 Redirection avec ref:', finalUrl);
        window.location.href = finalUrl;
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null; // Ce composant n'affiche rien
}