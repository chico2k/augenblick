import React from "react";
import NextImage from "next/image";

import partner from "/public/partner/partner.png";

const PartnerSection = () => {
  return (
    <section className=" relative isolate my-40 after:absolute after:inset-0 after:-z-10 after:-skew-y-2 after:bg-gradient-to-b after:from-fuchsia-500  after:via-fuchsia-300  md:after:bg-gradient-to-r md:after:to-fuchsia-100 lg:mt-72">
      <div className="mx-auto max-w-7xl pt-16 pb-12  md:grid md:grid-cols-2">
        <div className="px-6 pt-12 md:px-12 md:pr-16">
          <h2 className="mb-3 text-4xl text-white md:text-3xl xl:text-5xl">
            Meine Partnerin
          </h2>
          <p className="mt-2 text-base text-gray-800 md:mt-6 md:text-xl">
            Inhaberin von Premiumcosmetic und langjährige Freundin, Elli
            Steffel.
          </p>

          <div className="fill-gray-800 text-gray-800">
            <div className="mt-8 space-y-4 text-xs md:mt-12">
              <a
                href="https://goo.gl/maps/aqDVwsuGj7JGUbrj7"
                target="_blank"
                rel="noreferrer"
                className="group flex cursor-pointer"
              >
                <div className="flex items-center group-hover:text-gray-600">
                  <svg
                    className="h-6 w-6 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    ></path>
                  </svg>

                  <span className="ml-4  flex  items-center text-base lg:text-xl">
                    Carl-Orff-Straße 7, 83374 Traunreut
                  </span>
                </div>
              </a>
              <a
                href="https://www.instagram.com/premiumcosmetic_elli/"
                target="_blank"
                rel="noreferrer"
                className="group flex cursor-pointer "
              >
                <div className="t flex items-center group-hover:text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 flex-shrink-0  group-hover:fill-gray-600"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>

                  <span className="ml-4 flex items-center justify-center text-base lg:text-xl">
                    premiumcosmetic_elli
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="relative mt-12 overflow-hidden md:-my-36 md:shadow-2xl md:shadow-gray-700/30 lg:rounded-2xl ">
          <NextImage
            className="aspect-square object-cover md:h-full"
            src={partner}
            alt="Bild von Sandra Rudic"
            placeholder="blur"
          />
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
