import {redirect} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {createClientServer} from "@/lib/supabase/server";

// UI Components
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

// Icons
import {
    Phone,
    Edit,
    CalendarClock,
    FileText,
    CreditCard,
    Package,
    User,
    CheckCircle2,
    StickyNote,
    ListTodo, Settings2
} from "lucide-react";

// Custom Components
import PaymentsSection from "./payments";
import StatusSelect from "./status-select";
import ReadyAtPicker from "./ready-at-picker";
import AttachmentsSection from "./attachments";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

// ----- Types -----
type CustomerRow = {
    id: string;
    full_name: string;
    phone: string | null;
    email: string | null;
    city: string | null;
    country_code: string | null;
};

type OrderItemRow = {
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    currency_code: string;
};

type OrderRow = {
    id: string;
    status: string;
    notes: string | null;
    order_code: string | null;
    created_at: string;
    ready_at: string | null;
    currency_code: string;
    customer: CustomerRow | null;
    items: OrderItemRow[];
};

type TotalsRow = {
    order_id: string;
    items_subtotal: number | null;
    tax_total: number | null;
    discount_total: number | null;
    shipping_total: number | null;
    paid_total: number | null;
    computed_total: number | null;
};

type RouteParams = Promise<{ id: string }>;

export default async function OrderDetailPage({params}: { params: RouteParams }) {
    const {id} = await params;

    const sb = await createClientServer();
    const {data: {user}} = await sb.auth.getUser();
    if (!user) redirect("/login");

    // 1) Order with nested customer + items
    const {data: order, error} = await sb
        .schema("knitted")
        .from("orders")
        .select(`
      id, status, notes, order_code, created_at, ready_at, currency_code,
      customer:customers ( id, full_name, phone, email, city, country_code ),
      items:order_items ( id, description, quantity, unit_price, currency_code )
    `)
        .eq("id", id)
        .eq("owner", user.id)
        .single();

    if (!order) {
        return (
            <div className="flex h-[50vh] items-center justify-center flex-col gap-2 text-muted-foreground">
                <FileText className="h-10 w-10 opacity-20"/>
                <p>Order not found</p>
                {error && <pre className="text-xs opacity-50">{JSON.stringify(error, null, 2)}</pre>}
            </div>
        );
    }

    const ord = order as unknown as OrderRow;

    // 2) Totals
    const {data: totals} = await sb
        .schema("knitted")
        .from("order_totals")
        .select("*")
        .eq("order_id", id)
        .maybeSingle<TotalsRow>();

    const currency = ord.currency_code;
    const t = {
        subtotal: Number(totals?.items_subtotal ?? 0),
        tax: Number(totals?.tax_total ?? 0),
        discount: Number(totals?.discount_total ?? 0),
        shipping: Number(totals?.shipping_total ?? 0),
        total: Number(totals?.computed_total ?? totals?.items_subtotal ?? 0),
        paid: Number(totals?.paid_total ?? 0),
    };
    const balance = t.total - t.paid;

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">

            {/* --- Header --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/orders">Orders</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>
                                <BreadcrumbPage>Details</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {ord.order_code ?? `Order #${ord.id.slice(0, 8).toUpperCase()}`}
                        </h1>
                        <StatusBadge status={ord.status}/>
                    </div>
                </div>
            </div>

            {/* --- Main Layout Grid --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- LEFT COLUMN (Content) --- */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Items Card */}
                    <Card className="overflow-hidden border-border/60 shadow-sm">
                        <CardHeader className="bg-muted/30 border-b py-4">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Package className="w-4 h-4 text-primary"/> Order Items
                            </CardTitle>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[50%]">Description</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Unit Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className={"px-5"}>
                                    {(ord.items ?? []).map((it) => {
                                        const line = (Number(it.quantity) || 0) * (Number(it.unit_price) || 0);
                                        return (
                                            <TableRow key={it.id} className="hover:bg-muted/20 transition-colors">
                                                <TableCell className="font-medium text-foreground">
                                                    {it.description || "Custom Item"}
                                                </TableCell>
                                                <TableCell className="text-right">{it.quantity}</TableCell>
                                                <TableCell className="text-right tabular-nums text-muted-foreground">
                                                    {new Intl.NumberFormat('en-US', {
                                                        style: 'decimal',
                                                        minimumFractionDigits: 2
                                                    }).format(it.unit_price)}
                                                </TableCell>
                                                <TableCell className="text-right font-medium tabular-nums">
                                                    {it.currency_code} {line.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {(!ord.items || ord.items.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                <div
                                                    className="flex flex-col items-center justify-center text-muted-foreground gap-1">
                                                    <Package className="h-8 w-8 opacity-20"/>
                                                    <p className="text-sm">No items added yet.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    {/* Payments Section */}
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-primary"/> Payments
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PaymentsSection orderId={ord.id} currency={currency}/>
                        </CardContent>
                    </Card>

                    {/* Attachments Section */}
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary"/> Attachments & Measurements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AttachmentsSection orderId={ord.id}/>
                        </CardContent>
                    </Card>
                </div>

                {/* --- RIGHT COLUMN (Sidebar) --- */}
                <div className="space-y-8">

                    {/* 1. Customer Profile Card */}
                    <Card className="overflow-hidden border-border/60 shadow-sm">
                        <div className="p-6 flex items-center gap-4 bg-card">
                            <div className="relative h-16 w-16 shrink-0">
                                <Image
                                    src={`https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(ord.customer?.full_name || "Guest")}`}
                                    alt="Avatar"
                                    fill
                                    className="rounded-full object-cover border-2 border-border"
                                    unoptimized
                                />
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="text-lg font-semibold truncate">{ord.customer?.full_name || "Unknown Customer"}</h3>
                                <p className="text-sm text-muted-foreground truncate">
                                    {ord.customer?.city ?? "No City"}
                                    {ord.customer?.country_code ? `, ${ord.customer.country_code}` : ""}
                                </p>
                            </div>
                        </div>
                        <Separator/>
                        <div className="p-2 grid grid-cols-2 divide-x">
                            <Button variant="ghost"
                                    className="w-full rounded-none h-12 text-muted-foreground hover:text-primary"
                                    asChild>
                                <Link href={`tel:${ord.customer?.phone}`}>
                                    <Phone className="w-4 h-4 mr-2"/> Call
                                </Link>
                            </Button>
                            <Button variant="ghost"
                                    className="w-full rounded-none h-12 text-muted-foreground hover:text-primary"
                                    asChild>
                                <Link href={`/clients/${ord.customer?.id}/edit`}>
                                    <Edit className="w-4 h-4 mr-2"/> Edit
                                </Link>
                            </Button>
                        </div>
                    </Card>

                    {/* 2. Order Management (Status & Dates) */}
                    <Card className="border-border/60 shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/30 py-3 border-b">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Settings2 className="w-4 h-4 text-primary"/>
                                Order Management
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-5 space-y-5">

                            {/* Status Control */}
                            <div className="space-y-2">
                                <label
                                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <ListTodo className="w-3.5 h-3.5"/> Current Status
                                </label>
                                <StatusSelect orderId={ord.id} initial={ord.status}/>
                            </div>

                            {/* Separator */}
                            <div className="h-px bg-border/60"/>

                            {/* Ready Date Control */}
                            <div className="space-y-2">
                                <label
                                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <CalendarClock className="w-3.5 h-3.5"/> Target Completion
                                </label>
                                <ReadyAtPicker orderId={ord.id} initial={ord.ready_at}/>
                            </div>

                            {/* Notes Section (Conditional) */}
                            {ord.notes && (
                                <>
                                    <div className="h-px bg-border/60"/>
                                    <div className="space-y-2">
                                        <label
                                            className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                            <StickyNote className="w-3.5 h-3.5"/> Order Notes
                                        </label>
                                        <div
                                            className="rounded-lg bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 p-3 text-sm text-foreground/90 leading-relaxed">
                                            {ord.notes}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* 3. Financial Summary */}
                    <Card className="border-border/60 shadow-sm bg-card/50">
                        <CardHeader className="pb-4 border-b border-dashed">
                            <CardTitle className="text-base">Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{currency} {t.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax</span>
                                <span>{currency} {t.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Discount</span>
                                <span className="text-red-500">-{currency} {t.discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>{currency} {t.shipping.toFixed(2)}</span>
                            </div>

                            <Separator className="my-2"/>

                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">Total</span>
                                <span className="font-bold text-lg">{currency} {t.total.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Amount Paid</span>
                                <span>{currency} {t.paid.toFixed(2)}</span>
                            </div>
                        </CardContent>

                        <CardFooter className="bg-muted/30 pt-4">
                            <div className="flex justify-between w-full items-center">
                                <span className="font-medium text-sm">Balance Due</span>
                                <span
                                    className={`font-bold text-xl ${balance > 0 ? "text-amber-600" : "text-green-600"}`}>
                  {currency} {balance <= 0 ? "0.00" : balance.toFixed(2)}
                </span>
                            </div>
                        </CardFooter>
                    </Card>

                </div>
            </div>
        </div>
    );
}