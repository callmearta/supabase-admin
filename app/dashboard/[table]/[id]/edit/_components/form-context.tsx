import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

const FormContext = createContext<{ formData: any, setFormData: Dispatch<SetStateAction<any>> } | null>(null);

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useFormContext must be used within a FormProvider");
    }
    const { formData, setFormData } = context;
    return { formData, setFormData };
}

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
    const [formData, setFormData] = useState({
        removedRelationalItems: [],
        addedRelationalItems: []
    });
    return <FormContext.Provider value={{ formData, setFormData }}>{children}</FormContext.Provider>
}

export default FormContext;