// "use client";
//
// import { useEffect } from "react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { createClientBrowser } from "@/lib/supabase/browser";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
//
// // --- Schema & Types ---------------------------------------------------------
//
// const Schema = z.object({
//     description: z.string().min(2, "Description is required"),
//     quantity: z
//         .coerce
//         .number()
//         .refine((n) => Number.isFinite(n), { message: "Quantity must be a number" })
//         .refine((n) => Number.isInteger(n), { message: "Quantity must be a whole number" })
//         .gt(0, { message: "Quantity must be > 0" }),
//     unit_price: z
//         .coerce
//         .number()
//         .refine((n) => Number.isFinite(n), { message: "Unit price must be a number" })
//         .min(0, { message: "Unit price must be ≥ 0" }),
//     currency_code: z
//         .string()
//         .length(3, "Use a 3-letter currency code")
//         .transform((s) => s.toUpperCase()),
// });
//
// type FormValues = z.infer<typeof Schema>;
//
// type Item = {
//     id: string;
//     description: string;
//     quantity: number;
//     unit_price: number;
//     currency_code: string;
// };
//
// export default function ItemDialog({
//                                        open,
//                                        onOpenChange,
//                                        orderId,
//                                        defaultCurrency,
//                                        editItem,
//                                        onSaved,
//                                    }: {
//     open: boolean;
//     onOpenChange: (v: boolean) => void;
//     orderId: string;
//     defaultCurrency: string;
//     editItem: Item | null;
//     onSaved: () => Promise<void> | void;
// }) {
//     const sb = createClientBrowser();
//
//     const {
//         register,
//         handleSubmit,
//         reset,
//         setValue,
//         formState: { errors, isSubmitting },
//     } = useForm<FormValues>({
//         resolver: zodResolver(Schema),
//         defaultValues: {
//             description: "",
//             quantity: 1,
//             unit_price: 0,
//             currency_code: defaultCurrency?.toUpperCase() || "GHS",
//         },
//         mode: "onBlur",
//     });
//
//     // Initialize/patch values when dialog opens or when editItem changes
//     useEffect(() => {
//         if (editItem) {
//             reset({
//                 description: editItem.description ?? "",
//                 quantity: Number(editItem.quantity ?? 1),
//                 unit_price: Number(editItem.unit_price ?? 0),
//                 currency_code: (editItem.currency_code ?? defaultCurrency ?? "GHS").toUpperCase(),
//             });
//         } else {
//             reset({
//                 description: "",
//                 quantity: 1,
//                 unit_price: 0,
//                 currency_code: (defaultCurrency ?? "GHS").toUpperCase(),
//             });
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [editItem, defaultCurrency, open]);
//
//     async function onSubmit(values: FormValues) {
//         try {
//             if (editItem) {
//                 const { error } = await sb
//                     .schema("knitted")
//                     .from("order_items")
//                     .update({
//                         description: values.description,
//                         quantity: values.quantity,
//                         unit_price: values.unit_price,
//                         currency_code: values.currency_code,
//                     })
//                     .eq("id", editItem.id);
//
//                 if (error) throw error;
//                 toast.success("Item updated");
//             } else {
//                 const { error } = await sb
//                     .schema("knitted")
//                     .from("order_items")
//                     .insert({
//                         order_id: orderId,
//                         description: values.description,
//                         quantity: values.quantity,
//                         unit_price: values.unit_price,
//                         currency_code: values.currency_code,
//                     });
//
//                 if (error) throw error;
//                 toast.success("Item added");
//             }
//
//             onOpenChange(false);
//             await onSaved();
//         } catch (e: any) {
//             toast.error("Save failed", { description: e?.message ?? String(e) });
//         }
//     }
//
//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>{editItem ? "Edit item" : "Add item"}</DialogTitle>
//                 </DialogHeader>
//
//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
//                     <div className="space-y-1">
//                         <Label htmlFor="desc">Description</Label>
//                         <Input id="desc" {...register("description")} />
//                         {errors.description && (
//                             <p className="text-sm text-red-500">{errors.description.message}</p>
//                         )}
//                     </div>
//
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                         <div className="space-y-1">
//                             <Label htmlFor="qty">Quantity</Label>
//                             <Input
//                                 id="qty"
//                                 type="number"
//                                 {...register("quantity", { valueAsNumber: true })}
//                             />
//                             {errors.quantity && (
//                                 <p className="text-sm text-red-500">{errors.quantity.message}</p>
//                             )}
//                         </div>
//
//                         <div className="space-y-1">
//                             <Label htmlFor="unit">Unit price</Label>
//                             <Input
//                                 id="unit"
//                                 type="number"
//                                 step="0.01"
//                                 {...register("unit_price", { valueAsNumber: true })}
//                             />
//                             {errors.unit_price && (
//                                 <p className="text-sm text-red-500">{errors.unit_price.message}</p>
//                             )}
//                         </div>
//
//                         <div className="space-y-1">
//                             <Label htmlFor="currency">Currency</Label>
//                             <select
//                                 id="currency"
//                                 className="w-full border rounded px-3 py-2 bg-background"
//                                 defaultValue={(editItem?.currency_code ?? defaultCurrency ?? "GHS").toUpperCase()}
//                                 {...register("currency_code", {
//                                     setValueAs: (v) => String(v || "").toUpperCase(),
//                                 })}
//                                 onChange={(e) => setValue("currency_code", e.target.value.toUpperCase())}
//                             >
//                                 <option value="GHS">GHS</option>
//                                 <option value="USD">USD</option>
//                                 <option value="EUR">EUR</option>
//                                 <option value="NGN">NGN</option>
//                                 <option value="GBP">GBP</option>
//                             </select>
//                             {errors.currency_code && (
//                                 <p className="text-sm text-red-500">
//                                     {errors.currency_code.message}
//                                 </p>
//                             )}
//                         </div>
//                     </div>
//
//                     <DialogFooter className="pt-2">
//                         <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//                             Cancel
//                         </Button>
//                         <Button type="submit" disabled={isSubmitting}>
//                             {isSubmitting ? "Saving…" : "Save"}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }