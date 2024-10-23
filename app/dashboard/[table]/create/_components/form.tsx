"use client";
import { saveDataToSupabase } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { CheckIcon, RotateCwIcon } from "lucide-react";
import {
  FormEventHandler,
  PropsWithChildren,
  use,
  useRef,
  useState,
} from "react";

export default function Form({
  table,
  children,
}: PropsWithChildren<{ table: string }>) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const _handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    if (!formRef.current) return;
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(formRef.current);
    // formData.values().forEach((v) => console.log(v));
    const result = await saveDataToSupabase(table, formData);
    console.log(result);
    setIsLoading(false);
  };
  return (
    <form ref={formRef} onSubmit={_handleSubmit}>
      {children}
      <div className="flex justify-end mt-16 pt-4 border-t border-t-border">
        <Button disabled={isLoading} variant={"default"}>
          {isLoading ? (
            <>
              <RotateCwIcon size={14} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckIcon size={14} className="mr-2" />
              Save
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
