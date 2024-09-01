import React from 'react';
import './DownloadICSSection.css';

const DownloadICSSection = ({ icsLink, isDisabled }) => {
    return (
        <div className="download-button-container">
            <a href={icsLink} download className={`download-button ${isDisabled ? 'disabled' : ''}`} onClick={(e) => isDisabled && e.preventDefault()}>
                Télécharger le fichier .ics pour l'importer sur un calendrier externe
            </a>
        </div>
    );
};

export default DownloadICSSection;
