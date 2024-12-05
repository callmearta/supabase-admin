"use client";

import { ChangeEvent, HTMLAttributes, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { uploadFileToSupabase } from "@/app/actions";
import { getStoreInFieldName } from "@/utils/getStoreInFieldName";
import { useParams } from "next/navigation";
import { PlusIcon, UploadIcon, XIcon } from "lucide-react";
import { getRelationalColumn } from "@/utils/hasTableViewOverride";
import UploadedFile from "@/components/ui/uploaded-file";
import isRelational from "@/utils/isRelational";
import { toast } from "@/hooks/use-toast";
import getBucketName from "@/utils/getBucketName";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

export default function FileInput({
    onChange,
    multiple,
    disableAutoUpload,
    defaultValue,
    ...rest
}: InputProps & {
    onChange?: (files: File[]) => void;
    disableAutoUpload?: boolean
}) {
    const supabase = createClient();
    const { table, id } = useParams();
    const hiddenRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [defaultValueFiles, setDefaultValueFiles] = useState<string | any[] | null>(defaultValue as string | any[] | null || null);
    const [isLoading, setIsLoading] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);
    const _handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!hiddenRef.current) return;
        if (multiple) {
            _handleMultiple(e);
            return;
        }
        const newFiles = e.target.files;
        if (!newFiles || !newFiles.length) return;
        const newFile = newFiles[0];
        setFiles([newFile]);
        if (typeof onChange != "undefined") onChange([newFile]);
        const url = URL.createObjectURL(newFile);
        // setPreviews([url]);
        setDefaultValueFiles(url);
        // if (disableAutoUpload) return;
        setIsLoading(true);
        const bucketName = getBucketName(table as string, rest.name as string) as string;
        const result = await uploadFileToSupabase(bucketName, newFile);
        
        if (result.data) {
            if (hiddenRef.current) hiddenRef.current.remove();
            const updateResult = await supabase.from(table as string).update({
                [rest.name as string]: result.data?.fullPath
            }).eq('id', id);
        
            if (updateResult.error) {
                toast({ title: updateResult.error.message, type: 'foreground' });
            }
        }
        setIsLoading(false);
        if (isRelational(table as string, rest.name as string)) {
            const relationalResult = await supabase.from(rest.name as string).insert({
                [getRelationalColumn(table as string, rest.name!) as string]: id,
                [getStoreInFieldName(table as string, rest.name!) as string]: result.data?.fullPath
            });
            if (!relationalResult.error) {
                toast({ title: 'File uploaded successfully', type: 'foreground' });
                setDefaultValueFiles((prev) => [...(prev as string[]), {[getStoreInFieldName(table as string, rest.name!) as string]:result.data?.fullPath}]);
                setPreviews([]);
            } else {
                toast({ title: relationalResult.error.message, type: 'foreground' });
            }
        }
    };
    function _handleMultiple(e: ChangeEvent<HTMLInputElement>) {
        setIsLoading(true);
        const newFiles = e.target.files;
        if (!newFiles || !newFiles.length) return;
        const newFilesArr = Array.from(newFiles);
        setFiles([...files, ...newFilesArr]);
        if (typeof onChange != "undefined") onChange([...files, ...newFilesArr]);
        Array.from(newFiles).forEach(async (file) => {
            const url = URL.createObjectURL(file);
            setPreviews((prev) => [...prev, url]);
            const result = await uploadFileToSupabase(getBucketName(table as string, rest.name as string) as string, file);
            if (result.error || !result.data) {
                toast({ title: result.error?.message || 'File upload to Supabase failed.', type: 'foreground' });
                return;
            }
            const relationalResult = await supabase.from(rest.name as string).insert({
                [getRelationalColumn(table as string, rest.name!) as string]: id,
                [getStoreInFieldName(table as string, rest.name!) as string]: result.data?.fullPath
            });
            if (relationalResult.error) {
                toast({ title: relationalResult.error.message, type: 'foreground' });
                return;
            } else {
                toast({ title: 'File uploaded successfully', type: 'foreground' });
                setDefaultValueFiles((prev) => [...(prev as string[]), {[getStoreInFieldName(table as string, rest.name!) as string]:result.data?.fullPath}]);
                setPreviews((prev) => prev.filter((preview) => preview != url));
            }
        });
        setIsLoading(false);
    };
    return (
        <div className="w-full">
            <div className={cn("w-full flex gap-2 flex-wrap border mb-4 p-4 rounded-2xl", { "opacity-50": isLoading })}>
                {!!defaultValueFiles &&
                    Array.isArray(defaultValueFiles) ? defaultValueFiles.map((preview) => (
                        <UploadedFile
                            file={preview[getStoreInFieldName(table as string, rest.name!) as string]}
                            imageUrl={preview[getStoreInFieldName(table as string, rest.name!) as string]}
                            table={table as string}
                            id={id as string}
                            key={preview[getStoreInFieldName(table as string, rest.name!) as keyof typeof preview]}
                            name={rest.name as string}
                        />
                    )) :
                    <UploadedFile
                        file={defaultValueFiles}
                        imageUrl={defaultValueFiles || ''}
                        table={table as string}
                        id={id as string}
                        name={rest.name as string}
                    />

                }
                {!!previews.length &&
                    previews.map((preview) => (
                        <div
                            key={preview}
                            className="w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center opacity-50"
                        >
                            <img src={preview} className="w-full h-full object-cover" />
                        </div>
                    ))
                }
                <div className="w-24 h-24 rounded-xl overflow-hidden relative flex items-center justify-center cursor-pointer border">
                    <Input
                        {...rest}
                        disabled={isLoading}
                        type="file"
                        multiple={multiple}
                        onChange={_handleChange}
                        name={disableAutoUpload ? rest.name : undefined}
                        className="absolute top-0 left-0 w-full h-full !opacity-0 cursor-pointer"
                    />
                    <span className="bg-white rounded-full flex items-center justify-center pointer-events-none">
                        {multiple ? <PlusIcon size={20} /> : <UploadIcon size={20} />}
                    </span>
                </div>
            </div>



            <input ref={hiddenRef} name={!disableAutoUpload ? rest.name : undefined} type="hidden" />
        </div>
    );
}
