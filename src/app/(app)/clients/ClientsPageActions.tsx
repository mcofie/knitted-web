"use client";

import {useRouter} from "next/navigation";
import AddClientDialog from "@/components/modals/add-client-dialog";

export default function CreateClientActionsClientX() {
    const router = useRouter();
    return (
        <AddClientDialog onCreated={() => router.refresh()}/>
    );
}