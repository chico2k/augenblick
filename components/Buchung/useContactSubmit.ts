import { IContactFormValues } from "../../lib/types";

const useContactSubmit = () => {

    const contactSubmitHandler = async (values: IContactFormValues): Promise<Boolean> => {

        try {
            const res = await fetch("/api/email", {
                body: JSON.stringify(values),
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
            });
            return true

        } catch {
            return false
        }

    }

    return { contactSubmitHandler }
}

export default useContactSubmit