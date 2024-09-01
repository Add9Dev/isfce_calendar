import React, { useState } from 'react';
import Calendar from './components/Calendar/Calendar';
import SectionSelector from './components/SectionSelector/SectionSelector';
import DownloadICSSection from "./components/DownloadICSSection/DownloadICSSection";
import sectionsData from './utils/sections.json';
import './App.css';

const App = () => {
    const [selectedCalendars, setSelectedCalendars] = useState([]);
    const [selectedIcsLink, setSelectedIcsLink] = useState('');

    const handleSelectSection = (selectedLevelObject) => {
        setSelectedCalendars([selectedLevelObject]);
        setSelectedIcsLink(selectedLevelObject?.icsLink || '');
    };

    return (
        <div className="App">
            <h1>Calendrier de l'ISFCE !</h1>
            <SectionSelector sections={sectionsData} onSelectSection={handleSelectSection} />
            <Calendar sectionCalendars={selectedCalendars} />
            <DownloadICSSection icsLink={selectedIcsLink} isDisabled={!selectedIcsLink} />
        </div>
    );
};

export default App;
