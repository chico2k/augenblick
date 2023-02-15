import { INewsletterFormValues } from "../../lib/types";

const useNewsletterSubmit = () => {
  const newsletterSubmitHandler = async (
    values: INewsletterFormValues
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
