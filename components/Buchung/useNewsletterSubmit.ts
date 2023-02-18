import { schemaNewsLetter } from "components/Newsletter";
import z from "zod";

const useNewsletterSubmit = () => {
  const newsletterSubmitHandler = async (
    values: z.infer<typeof schemaNewsLetter>
  ): Promise<Boolean> => {
    try {
      const res = await fetch("/api/newsletter", {
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

  return { newsletterSubmitHandler };
};

export default useNewsletterSubmit;
