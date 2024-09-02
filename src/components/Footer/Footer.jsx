// src/components/Footer.jsx
import React from 'react';
import './Footer.css'; // Assurez-vous de créer ce fichier pour les styles

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-links">
                <a href="/" className="footer-link">Voir les horaires</a>
                <a href="/course-planner" className="footer-link">Créer un horaire personnalisé</a>
                <a href="https://github.com/Add9Dev/isfce_calendar/" target="_blank" rel="noopener noreferrer"
                   className="footer-link">
                    Voir sur GitHub
                </a>
                <a href="https://isfce.org/" target="_blank" rel="noopener noreferrer" className="footer-link">
                    Aller sur le site de l'ISFCE
                </a>
            </div>
        </footer>
    );
};

export default Footer;
