'use client';
import {Button} from '@/components/ui/button';
import {createClientBrowser} from '@/lib/supabase/browser';
import {useToast} from '@/components/ui/use-toast';

export default function ShareButton({orderId}: { orderId: string }) {
    const {toast} = useToast();

    async function share() {
        const sb = createClientBrowser();
        try {
            const url = await sb.rpc('get_or_create_tracking_url', {p_order_id: orderId});
            if (navigator.share) await navigator.share({title: 'Track your order', url: url as string});
            else {
                await navigator.clipboard.writeText(url as string);
                toast({title: 'Link copied', description: String(url)});
            }
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            // toast({title: 'Failed to create link', description: e.message ?? String(e), variant: 'destructive'});
        }
    }

    return <Button onClick={share} size="sm">Share tracking link</Button>;
}