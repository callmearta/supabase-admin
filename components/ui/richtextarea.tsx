"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Column } from "@/types/column";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function RichTextArea({column}:{column:Column}) {
  const [value, setValue] = useState("");
  
  return (
    <>
    <ReactQuill
      theme="snow"
      value={value}
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
    <textarea readOnly className="hidden" name={column.column_name} value={value}></textarea>
    </>
  );
}
