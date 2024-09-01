// TODO : A CORRIGER / A REVOIR
import sectionsData from './sections.json';
import { rrulestr } from 'rrule';

export const fetchSections = async () => {
    try {
        return sectionsData;
    } catch (error) {
        console.error('Erreur lors du chargement des sections :', error);
        return [];
    }
};

export const parseICSFile = async (icsLink) => {
    try {
        const response = await fetch(icsLink);
        if (!response.ok) {
            console.error(`Erreur de réponse lors du chargement du fichier ICS: ${response.statusText}`);
            return [];
        }

        const icsText = await response.text();
        const events = [];
        const regex = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
        let match;

        while ((match = regex.exec(icsText)) !== null) {
            const eventText = match[1];
            const summaryMatch = /SUMMARY:(.*)/.exec(eventText);
            const startMatch = /DTSTART(;TZID=[^:]+)?:([^\s]+)/.exec(eventText);
            const endMatch = /DTEND(;TZID=[^:]+)?:([^\s]+)/.exec(eventText);
            const rruleMatch = /RRULE:(.*)/.exec(eventText);

            if (summaryMatch && startMatch && endMatch) {
                events.push({
                    summary: summaryMatch[1].trim(),
                    start: startMatch[2].trim(),
                    end: endMatch[2].trim(),
                    rrule: rruleMatch ? rruleMatch[1].trim() : null,
                    id: `${startMatch[2].trim()}-${endMatch[2].trim()}`
                });
            }
        }

        return events;
    } catch (error) {
        console.error('Erreur lors de l\'analyse du fichier ICS:', error);
        return [];
    }
};
