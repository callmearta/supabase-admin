"use client";
import { updateDataInSupabase } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { toast } from "@hooks/use-toast";
import { CheckIcon, RotateCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEventHandler, PropsWithChildren, useEffect, useRef, useState } from "react";
import { FormProvider } from "./form-context";

export default function Form({
  relationalData,
  table,
  id,
  children,
}: PropsWithChildren<{ table: string, id: string, relationalData: any }>) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialFormData, setInitialFormData] = useState<FormData | null>(null);
  const _handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    if (!formRef.current) return;
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(formRef.current);
    //formData.values().forEach((v) => console.log(v));

    const result = await updateDataInSupabase(table, formData, id, relationalData, initialFormData);
    if (result.error) {
      toast({ title: result.error.message });
    }
    if (result.status == 200) {
      toast({
        title: "Saved successfully",
        description: "Your data has been saved successfully.",
      });
      router.push(`/dashboard/${table}`);
    }
  };
  useEffect(() => {
    if (formRef.current) {
      setInitialFormData(new FormData(formRef.current));
    }
  }, [formRef]);
  return (
    <FormProvider>
      <form ref={formRef} onSubmit={_handleSubmit} encType="multipart/form-data">
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
    </FormProvider>
  );
}
