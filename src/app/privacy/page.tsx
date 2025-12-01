import { Metadata } from 'next';
import PrivacyClient from './privacy-client';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'How Knitted collects, uses, and protects your data across web, iOS, and Android.',
};

export default function PrivacyPage() {
    return <PrivacyClient />;
}