'use client';

import {useMemo} from 'react';

type AddToCalendarProps = {
    title: string;                // e.g., `Order KNT-00027 is ready`
    start: string;                // ISO string from ready_at
    durationMinutes?: number;     // default 30
    location?: string;            // optional
    description?: string;         // optional (plain text)
    filename?: string;            // default 'knitted-event.ics'
};

function fmtICSDate(d: Date) {
    // ICS needs UTC in YYYYMMDDTHHMMSSZ
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
        d.getUTCFullYear().toString() +
        pad(d.getUTCMonth() + 1) +
        pad(d.getUTCDate()) +
        'T' +
        pad(d.getUTCHours()) +
        pad(d.getUTCMinutes()) +
        pad(d.getUTCSeconds()) +
        'Z'
    );
}

function escapeICS(text: string) {
    // Escape commas, semicolons, backslashes; replace newlines
    return text
        .replace(/\\/g, '\\\\')
        .replace(/,/g, '\\,')
        .replace(/;/g, '\\;')
        .replace(/\r?\n/g, '\\n');
}

export function AddToCalendarButton(props: AddToCalendarProps) {
    const {
        title,
        start,
        durationMinutes = 30,
        location = '',
        description = '',
        filename = 'knitted-event.ics',
    } = props;

    const {startDate, endDate, googleUrl, icsContent} = useMemo(() => {
        const startDate = new Date(start);
        const endDate = new Date(startDate.getTime() + durationMinutes * 60_000);

        const text = title || 'Appointment';
        const details = description || '';
        const loc = location || '';

        // --- Google Calendar link (UTC, yyyyMMddTHHmmssZ) ---
        const googleUrl = new URL('https://calendar.google.com/calendar/render');
        googleUrl.searchParams.set('action', 'TEMPLATE');
        googleUrl.searchParams.set('text', text);
        googleUrl.searchParams.set('dates', `${fmtICSDate(startDate)}/${fmtICSDate(endDate)}`);
        if (details) googleUrl.searchParams.set('details', details);
        if (loc) googleUrl.searchParams.set('location', loc);

        // --- ICS (Apple/Outlook/etc.) ---
        const now = new Date();
        const uid = `knitted-${startDate.getTime()}@getknitted.app`;
        const ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Knitted//Public Tracking//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${fmtICSDate(now)}`,
            `DTSTART:${fmtICSDate(startDate)}`,
            `DTEND:${fmtICSDate(endDate)}`,
            `SUMMARY:${escapeICS(text)}`,
            loc ? `LOCATION:${escapeICS(loc)}` : '',
            details ? `DESCRIPTION:${escapeICS(details)}` : '',
            'END:VEVENT',
            'END:VCALENDAR',
        ]
            .filter(Boolean)
            .join('\r\n');

        return {startDate, endDate, googleUrl: googleUrl.toString(), icsContent: ics};
    }, [title, start, durationMinutes, location, description, filename]);

    function downloadICS() {
        const blob = new Blob([icsContent], {type: 'text/calendar;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('download', filename);
        a.href = url;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="flex flex-wrap md:flex-row flex-col lg:flex-row gap-2">
            <button
                type="button"
                onClick={downloadICS}
                className="inline-flex  items-center rounded-md border bg-purple-100 px-3 py-2 text-sm font-medium hover:bg-card/80"
            >
                Add to Apple/Outlook (ICS)
            </button>

            <a
                href={googleUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-md border bg-indigo-100 px-3 py-2 text-sm font-medium hover:bg-card/80"
            >
                Add to Google Calendar
            </a>
        </div>
    );
}