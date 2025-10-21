"use client";

import {useRouter} from "next/navigation";
import CreateOrderDialog from "@/components/modals/create-order-dialog";

export default function ClientActions({
                                          clientId,
                                          clientName,
                                      }: { clientId: string; clientName?: string }) {
    const router = useRouter();
    return (
        <div className="flex items-center gap-2">
            <CreateOrderDialog
                clientId={clientId}
                clientName={clientName}
                onCreated={() => router.refresh()}  // 🔄 refresh orders after success
            />
        </div>
    );
}