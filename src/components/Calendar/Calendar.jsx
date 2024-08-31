import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import iCalendarPlugin from '@fullcalendar/icalendar';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import './Calendar.css';

const Calendar = ({ sectionCalendars }) => {
    const [calendarSources, setCalendarSources] = useState([]);

    useEffect(() => {
        const sources = sectionCalendars.map((section) => ({
            url: section.icsLink,
            format: 'ics',
            color: section.color,
            textColor: 'white',
        }));

        setCalendarSources(sources);
    }, [sectionCalendars]);

    return (
        <div className="calendar-container">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, iCalendarPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={frLocale}
                weekends={true}
                hiddenDays={[0]}
                fixedWeekCount={false}
                showNonCurrentDates={false}
                firstDay={1}
                timeZone="Europe/Brussels"
                contentHeight="75vh"
                stickyHeaderDates={true}
                slotMinTime="07:00:00"
                slotMaxTime="23:59:00"
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5],
                    startTime: '07:00',
                    endTime: '23:59',
                }}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                eventSources={calendarSources}
            />
        </div>
    );
};

export default Calendar;
