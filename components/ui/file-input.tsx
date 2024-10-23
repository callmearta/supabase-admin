"use client";

import { ChangeEvent, HTMLAttributes, useState } from "react";
import { Input } from "./input";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function FileInput({
  onChange,
  multiple,
  ...rest
}: InputProps & {
  onChange?: (files: File[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const _handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
  };
  const _handleMultiple = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (!newFiles || !newFiles.length) return;
    const newFilesArr = Array.from(newFiles);
    setFiles([...files, ...newFilesArr]);
    if (typeof onChange != "undefined") onChange([...files, ...newFilesArr]);
    Array.from(newFiles).forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviews((prev) => [...prev, url]);
    });
  };
  return (
    <div className="w-full">
      <div className="w-full flex gap-2 flex-wrap border mb-4 p-4 rounded-2xl">
        {previews.map((preview) => (
          <div
            key={preview}
            className="w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center"
          >
            <img src={preview} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <Input {...rest} type="file" onChange={_handleChange} />
    </div>
  );
}
