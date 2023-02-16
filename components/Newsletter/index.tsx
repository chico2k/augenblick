import useNewsletterSubmit from "components/Buchung/useNewsletterSubmit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import NextLink from "next/link";

const schema = z.object({
  email: z
    .string({ required_error: "E-Mail ist ein Pflichtfeld" })
    .email({ message: "Bitte eine gültige E-Mail-Adresse eingeben" }),
});

export default function Newsletter() {
  const { newsletterSubmitHandler } = useNewsletterSubmit();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <div className="bg-fuchsia-500">
      <div className="mx-auto max-w-7xl py-12 px-6 lg:flex lg:items-center lg:py-32 lg:px-8">
        <div className="lg:w-0 lg:flex-1">
          <h2
            className="text-3xl font-semibold tracking-tight text-white sm:text-3xl"
            id="newsletter-headline"
          >
            Melde dich für den Newsletter an.
          </h2>
          <p className="mt-3 max-w-lg text-lg leading-6 text-gray-100">
            Verpasse keine Deals und Neuigkeiten mehr! Melde dich jetzt für den
            Newsletter an und bleibe immer up-to-date.
          </p>
        </div>
        <div className="mt-8 lg:mt-0 lg:ml-8">
          <form
            className="sm:flex"
            onSubmit={handleSubmit(
              async () =>
                await toast.promise(
                  newsletterSubmitHandler({ email: "mariogalla86@gmail.com" }),
                  {
                    pending: "Nachricht wird geschickt...",
                    success: "Wir haben E-Mail aufgenommen.",
                    error:
                      "Es ist etwas schiefgelaufen. Bitte probiere es nochmal.",
                  }
                )
            )}
          >
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              {...register("email")}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-md border border-transparent px-5 py-3 placeholder-gray-500 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 sm:max-w-xs"
              placeholder="E-Mail"
            />
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <button
                id="submit-newsletter"
                type="submit"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-fuchsia-800 px-5 py-3 text-base font-medium text-white hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Abschicken
              </button>
            </div>
          </form>
          <p className="mt-3 text-sm text-gray-100 ">
            Der Schutz Ihrer Daten liegt uns am Herzen. Lesen Sie unsere{" "}
            <NextLink
              href="/datenschutz"
              className="font-medium text-white underline"
            >
              Datenschutzrichtlinie.
            </NextLink>
          </p>
        </div>
      </div>
    </div>
  );
}
