"use client";

/* eslint-disable @typescript-eslint/no-misused-promises */
import { Element } from "react-scroll";
import React from "react";
import * as z from "zod";
import dynamic from "next/dynamic";
import useContactSubmit from "../lib/hooks/useContactSubmit";
import NextImage from "next/image";
import eye from "/public/form/Auge-Form.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ExclamationCircleIcon } from "@heroicons/react/outline";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
});

export const validationSchemaBuchung = z.object({
  name: z
    .string({ required_error: "Bitte einen Namen angeben." })
    .min(2, { message: "Bitte einen Namen angeben." }),

  email: z
    .string({ required_error: "Bitte eine E-Mail angeben." })
    .email({ message: "Ungültige E-Mail" }),

  message: z
    .string({ required_error: "Bitte eine Nachricht angeben." })
    .min(2, { message: "Bitte eine Nachricht angeben." }),

  robot: z.boolean({ required_error: `Bitte das Captcha ausfüllen.` }).refine(
    (val) => val === false,
    () => ({ message: `Bitte das Captcha ausfüllen.` })
  ),
  phone: z.string().optional(),
});

const BuchungsSection = () => {
  const { contactSubmitHandler } = useContactSubmit();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof validationSchemaBuchung>>({
    mode: "onTouched",
    resolver: zodResolver(validationSchemaBuchung),
  });

  return (
    <Element name="buchung">
      <div className=" lg:pb-18 relative mx-auto max-w-7xl bg-white ">
        <h2 className="bg-linear-to-tl from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 px-4 py-7 pl-5 text-3xl text-white md:px-12 lg:text-5xl">
          Buchung
        </h2>
        <div className="bg-fuchsia-50 pl-5  ">
          {isSubmitSuccessful && (
            <div className="py-12 pr-6 text-gray-700 md:py-16  ">
              <span className="flex items-center text-xl ">
                Vielen Dank für Ihre Nachricht. Wir werden uns so schnell wie
                möglich.
              </span>
            </div>
          )}
          {!isSubmitSuccessful && (
            <div className="lg:mb-18 pt-3 pr-6 sm:px-7 lg:col-span-2 xl:p-12">
              <form
                onSubmit={handleSubmit(contactSubmitHandler)}
                className="mt-6 grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-8 "
              >
                <div>
                  {/* NAME FIELD*/}
                  <div>
                    <div className="flex justify-between">
                      <label
                        htmlFor={"name"}
                        className={`block text-sm font-medium text-gray-900 lg:text-lg ${
                          errors["name"] ? "text-red-600" : ""
                        }`}
                      >
                        Name
                      </label>
                      <p className="text-sm text-red-600" id="email-error">
                        {errors["name"] ? errors["name"].message : ""}
                      </p>
                    </div>
                    <div className="relative mt-1 rounded-md shadow-xs">
                      <input
                        {...register("name")}
                        id={"name"}
                        name={"name"}
                        aria-label="Name"
                        className={`
                          ${
                            errors["name"]
                              ? "border border-red-600 placeholder-red-300"
                              : "border-white "
                          }
                          block w-full rounded-md border  border-fuchsia-100 py-3 px-4 text-gray-900 focus:border-fuchsia-400 focus:ring-fuchsia-500`}
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        {errors["name"] ? (
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {/* NAME  FIELD END */}

                  {/* E-Mail Field */}
                  <div className="mt-4">
                    <div className="flex justify-between">
                      <label
                        htmlFor={"email"}
                        className={`block text-sm font-medium text-gray-900 lg:text-lg ${
                          errors["email"] ? "text-red-600" : ""
                        }`}
                      >
                        E-Mail
                      </label>
                      <p className="text-sm text-red-600" id="email-error">
                        {errors["email"] ? errors["email"].message : ""}
                      </p>
                    </div>
                    <div className="relative mt-1 rounded-md shadow-xs">
                      <input
                        {...register("email")}
                        id={"email"}
                        name={"email"}
                        aria-label="Email Buchung"
                        className={`
        ${
          errors["email"]
            ? "border border-red-600 placeholder-red-300"
            : "border-white "
        }
        block w-full rounded-md border  border-fuchsia-100 py-3 px-4 text-gray-900 focus:border-fuchsia-400 focus:ring-fuchsia-500`}
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        {errors["email"] ? (
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {/* E-Mail FIELD END */}

                  {/* Phone Field Start */}
                  <div className="mt-4">
                    <div className="flex justify-between">
                      <label
                        htmlFor={"phone"}
                        className={`block text-sm font-medium text-gray-900 lg:text-lg ${
                          errors["phone"] ? "text-red-600" : ""
                        }`}
                      >
                        Telefon
                      </label>
                      <p className="text-sm text-red-600" id="phone-error">
                        {errors["phone"] ? errors["phone"].message : ""}
                      </p>
                    </div>
                    <div className="relative mt-1 rounded-md shadow-xs">
                      <input
                        {...register("phone")}
                        id={"phone"}
                        name={"phone"}
                        className={`
        ${
          errors["phone"]
            ? "border border-red-600 placeholder-red-300"
            : "border-white "
        }
        block w-full rounded-md border  border-fuchsia-100 py-3 px-4 text-gray-900 focus:border-fuchsia-400 focus:ring-fuchsia-500`}
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        {errors["phone"] ? (
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {/* Phone FIELD END */}
                  {/* Message FIELD Start */}
                  <div className="mt-4">
                    <div className="flex justify-between">
                      <label
                        htmlFor={"message"}
                        className={`block text-sm font-medium text-gray-900 lg:text-lg${
                          errors["message"] ? "text-red-600" : ""
                        }`}
                      >
                        Nachricht
                      </label>
                      <p className="text-sm text-red-600" id="email-error">
                        {errors["message"] ? errors["message"].message : ""}
                      </p>
                    </div>
                    <div className="relative mt-1 rounded-md shadow-xs">
                      <textarea
                        {...register("message")}
                        id={"message"}
                        name={"message"}
                        rows={4}
                        className={`
          ${
            errors["message"]
              ? "border border-red-600 placeholder-red-300"
              : "border-white "
          }
          block w-full rounded-md border-2 px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-2 focus:ring-offset-gray-900`}
                      />

                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        {errors["message"] ? (
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {/* Message FIELD END */}

                  <div className="my-1 mt-4">
                    <ReCAPTCHA
                      sitekey={"6Lf08AQlAAAAAO3_LaTiGH8H6liAn5NHp0OZxseP"}
                      onChange={() => setValue("robot", false)}
                      theme={"light"}
                    />
                  </div>
                  <p className="mb-4 text-sm text-red-600" id="robot-error">
                    {errors["robot"] ? errors["robot"].message : " "}
                  </p>
                  <div className="sm:flex sm:justify-start md:col-span-2">
                    <button
                      type="submit"
                      className="hbover:via-fuchsia-800 mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-linear-to-tl from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 px-6 py-3 text-base font-medium text-white 
        shadow-xs transition-all duration-300 ease-in-out  hover:bg-linear-to-l hover:from-fuchsia-900 hover:to-fuchsia-900 focus:outline-hidden focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 sm:w-auto"
                    >
                      Anfragen
                    </button>
                  </div>
                </div>

                <div className="hidden w-auto justify-center md:flex">
                  <NextImage
                    alt="Ein Frauenauge"
                    className="h-96 w-auto object-contain"
                    src={eye}
                  ></NextImage>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </Element>
  );
};

export default BuchungsSection;