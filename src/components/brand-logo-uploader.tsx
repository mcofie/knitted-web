// 'use client';
// import {useState} from 'react';
// import {createClientBrowser} from '@/lib/supabase/browser';
// import {Input} from '@/components/ui/input';
// import {toast} from 'sonner';
//
// export default function BrandLogoUploader() {
//     const sb = createClientBrowser();
//     // const {toast} = useToast();
//     const [preview, setPreview] = useState<string | null>(null);
//
//     async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
//         const f = e.target.files?.[0];
//         if (!f) return;
//         const {data: {user}} = await sb.auth.getUser();
//         if (!user) return toast.error('Please sign in');
//
//         const ext = f.name.split('.').pop() || 'png';
//         const path = `${user.id}/brand/logo_${Date.now()}.${ext}`;
//         const {error} = await sb.storage.from('knitted-brand').upload(path, f, {upsert: true});
//         if (error) return toast.error("'Upload failed'");
//
//         await sb.schema('knitted').from('account_settings').upsert({owner: user.id, logo_path: path}).select().single();
//
//         const {data: signed, error: sErr} = await sb.storage.from('knitted-brand').createSignedUrl(path, 3600);
//         if (sErr) return toast.error("Signed URL failed");
//         setPreview(signed?.signedUrl ?? null);
//         toast.success("Logo uploaded");
//     }
//
//     return (
//         <div className="space-y-2">
//             <Input type="file" accept="image/*" onChange={onPick} className="max-w-xs"/>
//             {preview && <img src={preview} alt="Logo" className="h-12 w-12 rounded-full object-cover"/>}
//         </div>
//     );
// }