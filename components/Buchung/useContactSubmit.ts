import { validationSchema } from "./Form";
import z from "zod";
import { useState } from "react";
import { toast } from "react-toastify";

const useContactSubmit = () => {
  const contactSubmitHandler = async (
    values: z.infer<typeof validationSchema>
  ) => {
    return await toast.promise(apiCall(values), {
      pending: "Nachricht wird geschickt...",
      success: "Wir haben deine Anfrage erhalten.",
      error: "Es ist etwas schiefgelaufen. Bitte probiere es nochmal.",
    });
  };

  const apiCall = async (
    values: z.infer<typeof validationSchema>
  ): Promise<Boolean> => {
    try {
      const res = await fetch("/api/email", {
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
