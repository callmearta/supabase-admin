"use client";

import { ChangeEvent, HTMLAttributes, useRef, useState } from "react";
import { Input } from "./input";
import { createClient } from "@/utils/supabase/client";
import { uploadFileToSupabase } from "@/app/actions";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

export default function FileInput({
  onChange,
  multiple,
  disableAutoUpload,
  ...rest
}: InputProps & {
  onChange?: (files: File[]) => void;
  disableAutoUpload?: boolean
}) {
  const hiddenRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
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
    setPreviews([url]);
    if (disableAutoUpload) return;
    const result = await uploadFileToSupabase("uploads", newFile);
    if (result.data) {
      hiddenRef.current.value = result.data?.fullPath;
    }
  };
  const _handleMultiple = (e: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const newFiles = e.target.files;
    if (!newFiles || !newFiles.length) return;
    const newFilesArr = Array.from(newFiles);
    setFiles([...files, ...newFilesArr]);
    if (typeof onChange != "undefined") onChange([...files, ...newFilesArr]);
    Array.from(newFiles).forEach(async (file) => {
      const url = URL.createObjectURL(file);
      setPreviews((prev) => [...prev, url]);
      if (disableAutoUpload) return;
      const result = await uploadFileToSupabase("uploads", file);
      console.log(result);
    });
    setIsLoading(false);
  };
  return (
    <div className="w-full">
      {!!previews.length && <div className="w-full flex gap-2 flex-wrap border mb-4 p-4 rounded-2xl">
        {previews.map((preview) => (
          <div
            key={preview}
            className="w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center"
          >
            <img src={preview} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>}
      <Input
        {...rest}
        disabled={isLoading}
        type="file"
        onChange={_handleChange}
        name={disableAutoUpload ? rest.name : undefined}
      />
      <input ref={hiddenRef} name={!disableAutoUpload ? rest.name : undefined} type="hidden" />
    </div>
  );
}
