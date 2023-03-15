import React from "react";
import NextLink from "next/link";
import Head from "next/head";

const NotFound = () => {
  return (
    <>
      <Head>
        <title>404 - Augenblick Chiemgau</title>
      </Head>
      <main className="grid min-h-full place-items-center bg-white py-36 px-6 sm:py-48 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-fuchsia-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-700 sm:text-5xl">
            Oops, diese Seite gibt es nicht!
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Entschuldigung, hier geht es nicht weiter.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <NextLink
              href="/"
              className="rounded-md bg-fuchsia-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-fuchsia-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-600"
            >
              Zurück zum Start
            </NextLink>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
