"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Column } from "@/types/column";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function RichTextArea({ column, name, defaultValue }: { column?: Column, name?: string, defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue || "");

  return (
    <>
      <ReactQuill
        theme="snow"
        value={value}
        defaultValue={defaultValue}
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["link", "image"],
            ["clean"],
          ],
        }}
        onChange={setValue}
      />
      <textarea readOnly className="hidden" name={name ? name : column?.column_name} value={value}></textarea>
    </>
  );
}
