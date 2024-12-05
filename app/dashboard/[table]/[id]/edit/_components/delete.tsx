'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
export default function Delete({ table, id }: { table: string, id: string }) {
    const supabase = createClient();
    const _handleDelete = async () => {
        const result = await supabase.from(table).delete().eq('id', id);
        if (result.error) {
            toast({ title: result.error.message, type: 'foreground' });
        } else {
            toast({ title: 'Deleted successfully', type: 'foreground' });
            redirect(`/dashboard/${table}`);
        }
    }
    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="destructive">
                Delete
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete this entity and it is not recoverable.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button type="submit" variant="destructive" onClick={_handleDelete}>Confirm</Button>
                <DialogClose asChild>
                    <Button type="submit" variant="outline">Cancel</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}