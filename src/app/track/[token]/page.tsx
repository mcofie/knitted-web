// import {createClientServer} from '@/lib/supabase/server';
// import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
// import {Badge} from '@/components/ui/badge';
// import {Separator} from '@/components/ui/separator';
// import Image from 'next/image';
// import Link from 'next/link';
//
// // Adjust these types if your RPC returns slightly different names.
// type OrderItemView = {
//     id: string;
//     description: string;
//     quantity: number;
//     unit_price: number;
//     currency_code: string;
// };
//
// type RpcOrderStatus = {
//     order_id: string;
//     title: string | null;
//     status: string;
//     notes: string | null;
//
//     // money & dates
//     currency_code: string;
//     created_at: string;
//     ready_at: string | null;
//
//     // customer info (make sure your RPC selects/aliases these)
//     customer_name: string | null;
//     contact_email: string | null;
//     contact_phone: string | null;
//     location_city: string | null;
//     location_country_code: string | null;
//
//     // branding (from account_settings)
//     business_name: string | null;
//     logo_path: string | null;
//
//     // totals (from view or computed in RPC)
//     subtotal?: number | null;
//     tax?: number | null;
//     discount?: number | null;
//     shipping?: number | null;
//     total?: number | null;
//     computed_total?: number | null;
//     paid?: number | null;
//
//     // line items
//     items: OrderItemView[] | null;
// };
//
// // Match your app’s required interface exactly
// type OrderView = {
//     order_id: string;
//     title: string | null;
//     status: string;
//     notes: string | null;
//
//     currency: string;         // <-- required by your UI
//     created_at: string;
//     ready_at: string | null;
//
//     // required by your UI
//     total: number;
//     subtotal: number;
//     tax: number;
//     discount: number;
//     shipping: number;
//     paid: number;
//
//     // required by your UI
//     customer_name: string;
//     contact_email: string | null;
//     contact_phone: string | null;
//     location_city: string | null;
//     location_country_code: string | null;
//
//     // branding
//     business_name: string | null;
//     logo_url: string | null;
//
//     items: OrderItemView[];
// };
//
// // Helper: coerce RPC (object or array) → first row
// function firstRow<T>(x: unknown): T | null {
//     if (x == null) return null;
//     return Array.isArray(x) ? ((x[0] ?? null) as T | null) : (x as T);
// }
//
// export async function fetchOrder(token: string): Promise<OrderView | null> {
//     const sb = createClientServer();
//
//     const { data, error } = await sb.rpc("order_status_by_token", { p_token: token });
//     if (error) return null;
//
//     const row = firstRow<RpcOrderStatus>(data);
//     if (!row) return null;
//
//     // Sign logo (optional)
//     let signedLogo: string | null = null;
//     if (row.logo_path) {
//         try {
//             const { data: signed } = await sb.storage
//                 .from("knitted-brand")
//                 .createSignedUrl(row.logo_path, 3600);
//             signedLogo = signed?.signedUrl ?? null;
//         } catch {
//             signedLogo = null;
//         }
//     }
//
//     // Normalize & map to your exact OrderView shape
//     const currency = row.currency_code;
//     const subtotal = Number(row.subtotal ?? 0);
//     const tax      = Number(row.tax ?? 0);
//     const discount = Number(row.discount ?? 0);
//     const shipping = Number(row.shipping ?? 0);
//     const paid     = Number(row.paid ?? 0);
//
//     // prefer computed_total > total > fallback
//     const total = Number(row.computed_total ?? row.total ?? subtotal + tax + shipping - discount);
//
//     const view: OrderView = {
//         order_id: row.order_id,
//         title: row.title ?? null,
//         status: row.status,
//         notes: row.notes ?? null,
//
//         currency,
//         created_at: row.created_at,
//         ready_at: row.ready_at,
//
//         total,
//         subtotal,
//         tax,
//         discount,
//         shipping,
//         paid,
//
//         customer_name: row.customer_name ?? "",          // required: default to empty string if null
//         contact_email: row.contact_email ?? null,
//         contact_phone: row.contact_phone ?? null,
//         location_city: row.location_city ?? null,
//         location_country_code: row.location_country_code ?? null,
//
//         business_name: row.business_name ?? null,
//         logo_url: signedLogo,
//
//         items: row.items ?? [],
//     };
//
//     return view;
// }
//
// function money(c: string | null, n: number | null) {
//     return `${c ?? ''} ${(Number(n ?? 0)).toFixed(2)}`;
// }
//
// export default async function TrackPage({params}: { params: { token: string } }) {
//     const order = await fetchOrder(params.token);
//     if (!order) {
//         return (
//             <main className="mx-auto max-w-2xl p-6 space-y-4">
//                 <Card><CardHeader><CardTitle>Order not found</CardTitle></CardHeader>
//                     <CardContent className="text-sm text-muted-foreground">Check the link and try again, or contact your
//                         tailor.</CardContent>
//                 </Card>
//             </main>
//         );
//     }
//     const readyAt = order.ready_at ? new Date(order.ready_at) : null;
//
//     return (
//         <main className="mx-auto max-w-2xl p-6 space-y-6">
//             {/* Branding */}
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                     {order?.logo_url ? (
//                         <Image src={order?.logo_url} alt="Logo" width={36} height={36}
//                                className="rounded-full object-cover"/>
//                     ) : (<div className="h-9 w-9 rounded-full bg-muted"/>)}
//                     <div className="font-semibold">{order.business_name ?? 'Knitted'}</div>
//                 </div>
//                 <Link href="/" className="text-sm text-muted-foreground hover:underline">Home</Link>
//             </div>
//
//             {/* Order summary */}
//             <Card>
//                 <CardHeader className="pb-2">
//                     <CardTitle>{order.title ?? `#${order.order_id.slice(0, 8).toUpperCase()}`}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="text-sm text-muted-foreground space-y-2">
//                     <div className="flex flex-wrap items-center gap-2">
//                         <Badge variant={order.status === 'overdue' ? 'destructive' : 'secondary'}>{order.status}</Badge>
//                         {order.customer_name && <span>· {order.customer_name}</span>}
//                         {readyAt && <span>· Ready {readyAt.toLocaleString()}</span>}
//                     </div>
//                     <div className="flex items-center justify-between pt-2">
//                         <div className="text-base font-medium">{money(order.currency, order.total)}</div>
//                         {readyAt && (
//                             <a
//                                 className="text-sm underline"
//                                 href={`/track/${order.order_id}/ics?title=${encodeURIComponent(order.title ?? 'Order Ready')}&ready=${encodeURIComponent(readyAt.toISOString())}`}
//                             >Add to Calendar</a>
//                         )}
//                     </div>
//                 </CardContent>
//             </Card>
//
//             {/* Items */}
//             <Card>
//                 <CardHeader className="pb-2"><CardTitle className="text-base">Items</CardTitle></CardHeader>
//                 <CardContent>
//                     {order.items?.length ? (
//                         <div className="space-y-3">
//                             {order.items.map((it, i) => (
//                                 <div key={i} className="flex items-center justify-between text-sm">
//                                     <div>
//                                         <div className="font-medium">{it.description}</div>
//                                         <div className="text-muted-foreground">Qty {it.quantity}</div>
//                                     </div>
//                                     <div className="font-medium">{money(it.currency, it.unit_price * it.quantity)}</div>
//                                 </div>
//                             ))}
//                             <Separator/>
//                             <div className="flex items-center justify-between font-semibold">
//                                 <div>Total</div>
//                                 <div>{money(order.currency, order.total)}</div>
//                             </div>
//                         </div>
//                     ) : (<div className="text-sm text-muted-foreground">No items attached.</div>)}
//                 </CardContent>
//             </Card>
//
//             {/* Invoice (latest) */}
//             {(order?.invoice_id || order?.invoice_number) && (
//                 <Card>
//                     <CardHeader className="pb-2"><CardTitle className="text-base">Invoice</CardTitle></CardHeader>
//                     <CardContent className="text-sm text-muted-foreground space-y-1">
//                         <div>Invoice No: <span className="font-medium">{order.invoice_number ?? '—'}</span></div>
//                         <div>Amount: <span className="font-medium">{money(order.currency, order.invoice_total)}</span>
//                         </div>
//                         {order.invoice_due_at && (<div>Due: <span
//                             className="font-medium">{new Date(order.invoice_due_at).toLocaleString()}</span></div>)}
//                         {order.invoice_status && (
//                             <div>Status: <Badge variant="secondary">{order.invoice_status}</Badge></div>)}
//                     </CardContent>
//                 </Card>
//             )}
//
//             {/* Contact tailor */}
//             <Card>
//                 <CardHeader className="pb-2"><CardTitle className="text-base">Contact your
//                     tailor</CardTitle></CardHeader>
//                 <CardContent className="text-sm text-muted-foreground space-y-2">
//                     {order.contact_phone && (<div>Phone: <a className="underline"
//                                                             href={`tel:${order.contact_phone}`}>{order.contact_phone}</a>
//                     </div>)}
//                     {order.contact_email && (<div>Email: <a className="underline"
//                                                             href={`mailto:${order.contact_email}`}>{order.contact_email}</a>
//                     </div>)}
//                     {(order.city || order.country_code) && (
//                         <div>Location: {order.city ?? '—'} {order.country_code ? `• ${order.country_code}` : ''}</div>)}
//                 </CardContent>
//             </Card>
//         </main>
//     );
// }