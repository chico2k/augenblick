import type z from "zod";
import { toast } from "react-toastify";
import type { validationSchemaBuchung } from "../../components/Buchung";

const useContactSubmit = () => {
  const contactSubmitHandler = async (
    values: z.infer<typeof validationSchemaBuchung>
  ) => {
    return toast.promise(apiCall(values), {
      pending: "Nachricht wird geschickt...",
      success: "Wir haben deine Anfrage erhalten.",
      error: "Es ist etwas schiefgelaufen. Bitte probiere es nochmal.",
    });
  };

  const apiCall = async (
    values: z.infer<typeof validationSchemaBuchung>
  ): Promise<boolean> => {
    try {
      await fetch("/api/email", {
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      return true;
    } catch {
      return false;
    }
  };

  return { contactSubmitHandler };
};

export default useContactSubmit;
