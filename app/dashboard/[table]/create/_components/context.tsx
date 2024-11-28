import { createContext, PropsWithChildren, useContext, useState } from "react";

export const FormContext = createContext<any>(null);

export const FormProvider = ({ children }: PropsWithChildren) => {
    const [form, setForm] = useState<any>({
        disabled: false
    });
    return <FormContext.Provider value={{ form, setForm }}>
        {children}
    </FormContext.Provider>
}

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) throw new Error("useFormContext must be used within a FormProvider");
    return context;
}

