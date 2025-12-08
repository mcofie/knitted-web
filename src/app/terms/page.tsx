import { Metadata } from 'next';
import TermsClient from './terms-client';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'The terms and conditions that govern your use of the Knitted platform.',
};

export default function TermsPage() {
    return <TermsClient />;
}
