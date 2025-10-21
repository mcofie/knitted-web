'use client';

import {useEffect, useState} from 'react';
import {createClientBrowser} from '@/lib/supabase/browser';
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {toast} from 'sonner';
// import ItemDialog from './item-dialog';

type Item = {
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    currency_code: string;
};

export default function OrderItems({orderId, currency}: { orderId: string; currency: string }) {
    const sb = createClientBrowser();
    const [items, setItems] = useState<Item[]>([]);
    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        const {data, error} = await sb
            .schema('knitted').from('order_items')
            .select('id, description, quantity, unit_price, currency_code')
            .eq('order_id', orderId)
            .order('created_at');
        setLoading(false);
        if (error) return toast.error("Load error");
        setItems((data ?? []) as Item[]);
    }

    async function remove(id: string) {
        if (!confirm('Remove this item?')) return;
        const {error} = await sb.schema('knitted').from('order_items').delete().eq('id', id);
        if (error) return toast.error("Delete error");
        await load();
    }

    useEffect(() => {
        load(); /* eslint-disable-next-line */
    }, [orderId]);

    const subTotal = items.reduce((s, i) => s + Number(i.unit_price) * Number(i.quantity), 0);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Items</h2>
                <Button size="sm" onClick={() => {
                    setEditItem(null);
                    setOpen(true);
                }}>Add item</Button>
            </div>

            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-20">Qty</TableHead>
                            <TableHead className="w-36">Unit</TableHead>
                            <TableHead className="w-36 text-right">Total</TableHead>
                            <TableHead className="w-40"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && (
                            <TableRow><TableCell colSpan={5}
                                                 className="py-6 text-center text-muted-foreground">Loading…</TableCell></TableRow>
                        )}
                        {!loading && items.length === 0 && (
                            <TableRow><TableCell colSpan={5} className="py-6 text-center text-muted-foreground">No items
                                yet</TableCell></TableRow>
                        )}
                        {items.map((it) => (
                            <TableRow key={it.id}>
                                <TableCell className="font-medium">{it.description}</TableCell>
                                <TableCell>{it.quantity}</TableCell>
                                <TableCell>{it.currency_code} {Number(it.unit_price).toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    {it.currency_code} {(Number(it.unit_price) * Number(it.quantity)).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" className="mr-2"
                                            onClick={() => {
                                                setEditItem(it);
                                                setOpen(true);
                                            }}>Edit</Button>
                                    <Button variant="destructive" size="sm"
                                            onClick={() => remove(it.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Separator/>
            <div className="flex justify-end text-sm">
                <div className="w-64 flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">{currency} {subTotal.toFixed(2)}</span>
                </div>
            </div>

            {/*<ItemDialog*/}
            {/*    open={open}*/}
            {/*    onOpenChange={(v) => setOpen(v)}*/}
            {/*    orderId={orderId}*/}
            {/*    defaultCurrency={currency}*/}
            {/*    editItem={editItem}*/}
            {/*    onSaved={load}*/}
            {/*/>*/}
        </div>
    );
}