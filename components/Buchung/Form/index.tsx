import { Formik } from "formik";
import React, { useState } from "react";
import { IContactFormValues } from "../../../lib/types";
import * as z from "zod";
import ContactFields from "./Field";
import dynamic from "next/dynamic";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { toast } from "react-toastify";
import useContactSubmit from "../useContactSubmit";
import NextImage from "next/image";
import eye from "/public/form/Auge-Form.png";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"));

const initialValues: IContactFormValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
  robot: true,
};

const validationSchema = z.object({
  name: z
    .string({ required_error: "Bitte geben Sie einen Namen ein." })
    .min(2, { message: "Bitte geben Sie einen Namen ein." }),
  email: z
    .string({ required_error: "Bitte geben Sie einen E-Mail ein." })
    .email({ message: "Ungültige E-Mail" }),
  message: z.string({ required_error: "Bitte geben Sie einen Nachricht ein." }),
  robot: z.boolean().refine(
    (val) => val === false,
    (val) => ({ message: `Bitte das Captcha ausfüllen.` })
  ),
  phone: z.string().optional(),
});

const BuchungsForm = () => {
  const { contactSubmitHandler } = useContactSubmit();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (hasSubmitted) {
    return (
      <>
        <div className="pt-16 text-gray-700 pb-8 pr-6  lg:col-span-2 lg:mb-18 ">
          <span className="text-xl">
            Vielen Dank für Ihre Nachricht. Wir werden uns so schnell wie
            möglich.
          </span>
        </div>
      </>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (vales) => {
        await toast.promise(contactSubmitHandler(vales), {
          pending: "Nachricht wird geschickt...",
          success: "Wir haben deine Anfrage erhalten.",
          error: "Es ist etwas schiefgelaufen. Bitte probiere es nochmal.",
        });

        return setHasSubmitted(true);
      }}
      validationSchema={toFormikValidationSchema(validationSchema)}
    >
      {({
        handleSubmit,
        errors,
        touched,
        setFieldValue,
        status,
        values,
        isSubmitting,
      }) => {
        return (
          <>
            <div className="pt-3 pr-6 sm:px-7 lg:col-span-2 lg:mb-18 xl:p-12">
              <form
                onSubmit={handleSubmit}
                className="mt-6 grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-8 "
              >
                <div>
                  <ContactFields
                    fieldName="name"
                    autoComplete="name"
                    label="Name"
                  />
                  <ContactFields
                    fieldName="email"
                    autoComplete="email"
                    label="Email"
                  />
                  <ContactFields
                    fieldName="phone"
                    autoComplete="phone"
                    label="Telefon"
                  />

                  <ContactFields
                    fieldName="message"
                    textArea
                    label="Nachricht"
                  />
                </div>
                <div className="justify-center w-auto hidden md:flex">
                  <NextImage
                    alt="Eine Frau "
                    className="object-contain h-96 w-auto"
                    src={eye}
                  ></NextImage>
                </div>

                <div className="my-1">
                  <p className="mb-4 text-sm text-red-600" id="robot-error">
                    {errors["robot"] && touched["robot"]
                      ? errors["robot"]
                      : " "}
                  </p>
                  <p className="mb-4 text-sm text-red-600" id="robot-error">
                    {status && status["response"] ? status["response"] : " "}
                  </p>
                  {!!Object.keys(touched).length && (
                    <ReCAPTCHA
                      sitekey="6LePoBsgAAAAANy765Nz0Jl4gtYgXsJego5D8nHT"
                      onChange={() => setFieldValue("robot", false)}
                      theme={"light"}
                    />
                  )}
                </div>
                <div className="md:col-span-2 sm:flex sm:justify-start">
                  <button
                    type="submit"
                    className="mt-2 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-fuchsia-500 hover:bg-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 sm:w-auto"
                  >
                    Anfragen
                  </button>
                </div>
              </form>
            </div>
          </>
        );
      }}
    </Formik>
  );
};

export default BuchungsForm;
