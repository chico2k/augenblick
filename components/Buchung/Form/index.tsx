import React, { useState } from "react";
import * as z from "zod";
import dynamic from "next/dynamic";
import useContactSubmit from "../useContactSubmit";
import NextImage from "next/image";
import eye from "/public/form/Auge-Form.png";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ExclamationCircleIcon } from "@heroicons/react/outline";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"));

export const validationSchema = z.object({
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
    (val) => ({ message: `Bitte das Captcha ausfüllen.` })
  ),
  phone: z.string().optional(),
});

const BuchungsForm = () => {
  const { contactSubmitHandler } = useContactSubmit();

  const {
    register,
    handleSubmit,

    watch,
    setValue,
    formState: { errors, isSubmitSuccessful },
  } = useForm<z.infer<typeof validationSchema>>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  if (isSubmitSuccessful) {
    return (
      <>
        <div className="py-12 md:py-16 text-gray-700 pr-6  ">
          <span className="text-xl flex items-center ">
            Vielen Dank für Ihre Nachricht. Wir werden uns so schnell wie
            möglich.
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="pt-3 pr-6 sm:px-7 lg:col-span-2 lg:mb-18 xl:p-12">
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
                  className={`block text-sm font-medium text-gray-900 ${
                    errors["name"] ? "text-red-600" : ""
                  }`}
                >
                  Name
                </label>
                <p className="text-sm text-red-600" id="email-error">
                  {errors["name"] ? errors["name"].message : ""}
                </p>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  {...register("name")}
                  id={"name"}
                  name={"name"}
                  className={`
                ${
                  errors["name"]
                    ? "border border-red-600 placeholder-red-300"
                    : "border-white "
                }
                py-3 px-4 block w-full  text-gray-900 focus:ring-fuchsia-500 focus:border-fuchsia-400 border border-fuchsia-100 rounded-md`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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
                  className={`block text-sm font-medium text-gray-900 ${
                    errors["email"] ? "text-red-600" : ""
                  }`}
                >
                  E-Mail
                </label>
                <p className="text-sm text-red-600" id="email-error">
                  {errors["email"] ? errors["email"].message : ""}
                </p>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  {...register("email")}
                  id={"name"}
                  name={"email"}
                  className={`
                ${
                  errors["email"]
                    ? "border border-red-600 placeholder-red-300"
                    : "border-white "
                }
                py-3 px-4 block w-full  text-gray-900 focus:ring-fuchsia-500 focus:border-fuchsia-400 border border-fuchsia-100 rounded-md`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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
                  className={`block text-sm font-medium text-gray-900 ${
                    errors["phone"] ? "text-red-600" : ""
                  }`}
                >
                  Telefon
                </label>
                <p className="text-sm text-red-600" id="phone-error">
                  {errors["phone"] ? errors["phone"].message : ""}
                </p>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
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
                py-3 px-4 block w-full  text-gray-900 focus:ring-fuchsia-500 focus:border-fuchsia-400 border border-fuchsia-100 rounded-md`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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
                  className={`block text-sm font-medium text-gray-900 ${
                    errors["message"] ? "text-red-600" : ""
                  }`}
                >
                  Nachricht
                </label>
                <p className="text-sm text-red-600" id="email-error">
                  {errors["message"] ? errors["message"].message : ""}
                </p>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
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
                  block w-full px-4 py-3 rounded-md border-2 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-300 focus:ring-offset-gray-900`}
                />

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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
                sitekey="6LePoBsgAAAAANy765Nz0Jl4gtYgXsJego5D8nHT"
                onChange={() => setValue("robot", false)}
                theme={"light"}
              />
            </div>
            <p className="mb-4 text-sm text-red-600" id="robot-error">
              {errors["robot"] ? errors["robot"].message : " "}
            </p>
            <div className="md:col-span-2 sm:flex sm:justify-start">
              <button
                type="submit"
                className="mt-2 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-tl from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 
                hover:bg-gradient-to-l hover:from-fuchsia-900 hbover:via-fuchsia-800 hover:to-fuchsia-900  transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 sm:w-auto"
              >
                Anfragen
              </button>
            </div>
          </div>

          <div className="justify-center w-auto hidden md:flex">
            <NextImage
              alt="Ein Frauenauge"
              className="object-contain h-96 w-auto"
              src={eye}
            ></NextImage>
          </div>
        </form>
      </div>
    </>
  );
};

export default BuchungsForm;
