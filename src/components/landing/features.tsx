import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {Scissors, ClipboardList, CreditCard, Bell} from 'lucide-react';

const FEATURES = [
    {title: 'Client Management', icon: Scissors, desc: 'Store details, measurements, preferences.'},
    {title: 'Order Tracking', icon: ClipboardList, desc: 'From cutting to pickup, stay on top.'},
    {title: 'Payments & Invoices', icon: CreditCard, desc: 'Record payments and generate invoices.'},
    {title: 'Reminders & Notifications', icon: Bell, desc: 'Never miss deadlines again.'},
];

export function Features() {
    return (
        <section className="container mx-auto px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
                <Card key={f.title}>
                    <CardHeader>
                        <f.icon className="h-6 w-6 text-primary mb-2"/>
                        <CardTitle className="text-lg">{f.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">{f.desc}</CardContent>
                </Card>
            ))}
        </section>
    );
}