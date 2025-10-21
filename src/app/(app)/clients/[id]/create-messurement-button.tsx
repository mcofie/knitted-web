"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import MeasurementDialog from "./measurement-dialog";

export default function CreateMeasurementButton({ customerId }: { customerId: string }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>
                Add measurement
            </Button>

            <MeasurementDialog
                open={open}
                onOpenChange={(v) => {
                    setOpen(v);
                    if (!v) router.refresh(); // refresh server data after close
                }}
                customerId={customerId}
                editRow={null}            // create mode
                onSaved={() => router.refresh()}
            />
        </>
    );
}