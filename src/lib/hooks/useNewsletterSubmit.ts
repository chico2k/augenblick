interface NewsletterFormValues {
  email: string;
}

const useNewsletterSubmit = () => {
  const newsletterSubmitHandler = async (
    values: NewsletterFormValues
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
