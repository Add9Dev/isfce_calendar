import React, { useState } from 'react';
import './SectionSelector.css';

const SectionSelector = ({ sections, onSelectSection }) => {
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');

    const handleSectionChange = (event) => {
        const selected = event.target.value;
        setSelectedSection(selected);
        setSelectedLevel('');
    };

    const handleLevelChange = (event) => {
        const selected = event.target.value;
        setSelectedLevel(selected);

        const selectedSectionObject = sections.find(
            (section) => section.name === selectedSection
        );
        const selectedLevelObject = selectedSectionObject?.levels.find(
            (level) => level.name === selected
        );

        onSelectSection(selectedLevelObject);
    };

    const levelsForSelectedSection = selectedSection
        ? sections.find((section) => section.name === selectedSection)?.levels
        : [];

    return (
        <div className="selector-container">
            <div>
                <label htmlFor="section-select">Formation :</label>
                <select id="section-select" value={selectedSection} onChange={handleSectionChange}>
                    <option value="">Sélectionnez une section</option>
                    {sections.map((section, index) => (
                        <option key={index} value={section.name}>{section.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="level-select">Année :</label>
                <select
                    id="level-select"
                    value={selectedLevel}
                    onChange={handleLevelChange}
                    disabled={!selectedSection}
                >
                    <option value="">Sélectionnez un année</option>
                    {Array.isArray(levelsForSelectedSection) && levelsForSelectedSection.map((level, index) => (
                        <option key={index} value={level.name}>
                            {level.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SectionSelector;
