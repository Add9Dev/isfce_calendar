// TODO : A CORRIGER / A REVOIR
import React, { useState, useEffect } from 'react';
import './CoursePlanner.css';
import { fetchSections, parseICSFile } from '../utils/icsUtils';
import {rrulestr} from "rrule";

const CoursePlanner = () => {
    const [availableSections, setAvailableSections] = useState([]);
    const [openSectionIndex, setOpenSectionIndex] = useState(null);
    const [openLevelIndex, setOpenLevelIndex] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [coursesByLevel, setCoursesByLevel] = useState({});

    useEffect(() => {
        const loadSections = async () => {
            try {
                const sections = await fetchSections();
                setAvailableSections(sections);
            } catch (error) {
                console.error('Erreur lors du chargement des sections:', error);
            }
        };
        loadSections();
    }, []);

    const handleLevelClick = async (sectionIndex, levelIndex, icsLink) => {
        setOpenLevelIndex(openLevelIndex === levelIndex ? null : levelIndex);

        if (!coursesByLevel[icsLink]) {
            try {
                const courses = await parseICSFile(icsLink);
                const groupedCourses = groupCoursesBySummary(courses);

                setCoursesByLevel((prevCourses) => ({
                    ...prevCourses,
                    [icsLink]: groupedCourses,
                }));
            } catch (error) {
                console.error(`Erreur lors du chargement des cours pour ${icsLink}:`, error);
            }
        }
    };

    const handleCourseSelect = (groupedCourse) => {
        setSelectedCourses((prevSelected) =>
            prevSelected.some((c) => c.summary === groupedCourse.summary)
                ? prevSelected.filter((c) => c.summary !== groupedCourse.summary)
                : [...prevSelected, ...groupedCourse.sessions]
        );
    };

    const groupCoursesBySummary = (courses) => {
        const groupedCourses = {};

        courses.forEach((course) => {
            const baseSummary = course.summary.replace(/\(First Session\)|\(Second Session\)/g, '').trim();
            if (!groupedCourses[baseSummary]) {
                groupedCourses[baseSummary] = {
                    summary: baseSummary,
                    sessions: [course],
                };
            } else {
                groupedCourses[baseSummary].sessions.push(course);
            }
        });

        return Object.values(groupedCourses);
    };

    const handleDownloadICS = () => {
        const icsContent = generateICSContent(selectedCourses);
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'custom_schedule.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="course-planner-container">
            <div className="accordion-container">
                <h2 className="section-title">Liste des cours disponibles</h2>
                {availableSections.length > 0 ? (
                    availableSections.map((section, sectionIndex) => (
                        <Section
                            key={`section-${sectionIndex}`}
                            section={section}
                            sectionIndex={sectionIndex}
                            openSectionIndex={openSectionIndex}
                            setOpenSectionIndex={setOpenSectionIndex}
                            openLevelIndex={openLevelIndex}
                            handleLevelClick={handleLevelClick}
                            coursesByLevel={coursesByLevel}
                            selectedCourses={selectedCourses}
                            handleCourseSelect={handleCourseSelect}
                        />
                    ))
                ) : (
                    <p>Aucun cours disponible pour le moment.</p>
                )}
            </div>

            <SelectedCoursesList
                selectedCourses={selectedCourses}
                handleDownloadICS={handleDownloadICS}
            />
        </div>
    );
};

const Section = ({ section, sectionIndex, openSectionIndex, setOpenSectionIndex, openLevelIndex, handleLevelClick, coursesByLevel, selectedCourses, handleCourseSelect }) => (
    <div className="accordion-section">
        <div
            className="accordion-header"
            onClick={() => setOpenSectionIndex(openSectionIndex === sectionIndex ? null : sectionIndex)}
        >
            <h3>{section.name}</h3>
        </div>
        {openSectionIndex === sectionIndex && (
            <div className="accordion-content">
                {section.levels.map((level, levelIndex) => (
                    <Level
                        key={`level-${levelIndex}`}
                        level={level}
                        levelIndex={levelIndex}
                        sectionIndex={sectionIndex}
                        openLevelIndex={openLevelIndex}
                        handleLevelClick={handleLevelClick}
                        coursesByLevel={coursesByLevel}
                        selectedCourses={selectedCourses}
                        handleCourseSelect={handleCourseSelect}
                    />
                ))}
            </div>
        )}
    </div>
);

const Level = ({ level, levelIndex, sectionIndex, openLevelIndex, handleLevelClick, coursesByLevel, selectedCourses, handleCourseSelect }) => (
    <div className="accordion-level">
        <div
            className="accordion-level-header"
            onClick={() => handleLevelClick(sectionIndex, levelIndex, level.icsLink)}
            style={{ backgroundColor: level.color }}
        >
            <h4>{level.name}</h4>
        </div>
        {openLevelIndex === levelIndex && coursesByLevel[level.icsLink] !== undefined && (
            <div className="accordion-level-content">
                <ul>
                    {coursesByLevel[level.icsLink].length > 0 ? (
                        coursesByLevel[level.icsLink].map((groupedCourse, courseIndex) => (
                            <li key={`course-${courseIndex}`}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedCourses.some((c) => c.summary === groupedCourse.summary)}
                                        onChange={() => handleCourseSelect(groupedCourse)}
                                    />
                                    {groupedCourse.summary}
                                </label>
                            </li>
                        ))
                    ) : (
                        <p>Aucun cours disponible pour ce niveau.</p>
                    )}
                </ul>
            </div>
        )}
    </div>
);

const SelectedCoursesList = ({ selectedCourses, handleDownloadICS }) => (
    <div className="selected-course-list">
        <h2>Mes cours sélectionnés</h2>
        <ul>
            {selectedCourses.map((course) => (
                <li key={course.id}>{course.summary}</li>
            ))}
        </ul>
        <button onClick={handleDownloadICS} disabled={selectedCourses.length === 0}>
            Télécharger l'horaire personnalisé (.ics)
        </button>
    </div>
);

const generateICSContent = (courses) => {
    const icsHeader = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Votre Organisation//Calendrier Personnel//FR\n`;
    const icsFooter = `END:VCALENDAR`;

    const icsEvents = courses.map((course) => {
        if (course.rrule) {
            const rule = rrulestr(`DTSTART:${course.start}\nRRULE:${course.rrule}`);
            return rule.all().map((date) => {
                const start = formatDateToICS(date);
                const end = formatDateToICS(new Date(date.getTime() + (parseTime(course.end) - parseTime(course.start))));
                return `BEGIN:VEVENT\nSUMMARY:${course.summary}\nDTSTART:${start}\nDTEND:${end}\nEND:VEVENT`;
            }).join('\n');
        } else {
            return `BEGIN:VEVENT\nSUMMARY:${course.summary}\nDTSTART:${course.start}\nDTEND:${course.end}\nEND:VEVENT`;
        }
    }).join('\n');

    return `${icsHeader}${icsEvents}\n${icsFooter}`;
};

const formatDateToICS = (date) => {
    return date.toISOString().replace(/[-:]|\.\d{3}/g, '');
};

const parseTime = (timeString) => {
    const date = new Date(timeString);
    return isNaN(date) ? null : date.getTime();
};

export default CoursePlanner;