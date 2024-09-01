import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendar from './components/Calendar/Calendar';
import SectionSelector from './components/SectionSelector/SectionSelector';
import DownloadICSSection from './components/DownloadICSSection/DownloadICSSection';
import sectionsData from './utils/sections.json';
import './App.css';
import CoursePlanner from "./pages/CoursePlanner";
import Footer from "./components/Footer/Footer";

const App = () => {
    const [selectedCalendars, setSelectedCalendars] = useState([]);
    const [selectedIcsLink, setSelectedIcsLink] = useState('');

    const handleSelectSection = (selectedLevelObject) => {
        setSelectedCalendars([selectedLevelObject]);
        setSelectedIcsLink(selectedLevelObject?.icsLink || '');
    };

    return (
        <Router>
            <div className="App">
                <h1>Calendrier de l'ISFCE</h1>
                <Routes>
                    {/* Route principale pour l'affichage du calendrier et sélection de section */}
                    <Route
                        path="/"
                        element={
                            <>
                                <SectionSelector sections={sectionsData} onSelectSection={handleSelectSection} />
                                <Calendar sectionCalendars={selectedCalendars} />
                                <DownloadICSSection icsLink={selectedIcsLink} isDisabled={!selectedIcsLink} />
                            </>
                        }
                    />
                    {/* Nouvelle route pour la page de sélection de cours */}
                    <Route path="/course-planner" element={<CoursePlanner />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
};

export default App;
