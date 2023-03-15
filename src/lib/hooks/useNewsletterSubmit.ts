import type z from "zod";
import type { schemaNewsLetter } from "../../components/Newsletter";

const useNewsletterSubmit = () => {
  const newsletterSubmitHandler = async (
    values: z.infer<typeof schemaNewsLetter>
  ): Promise<boolean> => {
    try {
      await fetch("/api/newsletter", {
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
