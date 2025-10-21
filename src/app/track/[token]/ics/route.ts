import {NextRequest, NextResponse} from 'next/server';

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const title = searchParams.get('title') ?? 'Order Ready';
    const ready = searchParams.get('ready');
    if (!ready) return new NextResponse('Missing ready', {status: 400});

    const dt = new Date(ready);
    const dtStart = toICSDate(dt);
    const dtEnd = toICSDate(new Date(dt.getTime() + 60 * 60 * 1000));

    const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Knitted//EN',
        'BEGIN:VEVENT',
        `UID:${Math.random().toString(36).slice(2)}`,
        `DTSTAMP:${toICSDate(new Date())}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${escapeICS(title)} ready for pickup`,
        'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');

    return new NextResponse(ics, {
        status: 200,
        headers: {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': `attachment; filename="knitted-${Date.now()}.ics"`,
        },
    });
}

function toICSDate(d: Date) {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}

function escapeICS(s: string) {
    return s.replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');
}