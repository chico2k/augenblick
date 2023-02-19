// const Footer = () => {
//   return (
//     <footer className="bg-fuchsia-500 text-white pt-20 ">
//       <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
//         <div className="pl-5 grid grid-cols-2 grid-rows-2">
//           <div>Buchung</div>
//           <div>Datenschutz</div>
//           <div>Angebot</div>
//           <div>Impressum</div>
//         </div>
//         <div className="mt-16 pl-5 fill-gray-300 text-gray-300 "></div>
//         <div className="mt-16 ">
//           <p className="mt-8 text-center text-base text-gray-300">
//             <span className="mb-8"> 2023 Augenblick </span>&copy;
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

const navigation = {
  main: [
    { name: "Angebot", href: "#" },
    { name: "Meine Arbeit", href: "#" },
    { name: "Kundenmeinungen", href: "#" },
    { name: "Newsletter", href: "#" },
    { name: "Buchung", href: "#" },
    { name: "Partners", href: "#" },
  ],
  social: [
    {
      name: "Instagram",
      href: "https://www.instagram.com/augenblick_chiemgau/",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gradient-to-tl from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 text-white">
      <div className="mx-auto max-w-7xl overflow-hidden py-20 px-6 sm:py-24 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-6">
              <a
                href={item.href}
                className="text-sm leading-6 hover:text-fuchsia-200"
              >
                {item.name}
              </a>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex justify-center space-x-10">
          {navigation.social.map((item) => (
            <a
              target={"_blank"}
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-500"
              rel="noreferrer"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon
                className="fill-white hover:fill-fuchsia-200 h-6 w-6"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-xs leading-5 text-white">
          &copy; 2023 Augenblick
        </p>
      </div>
    </footer>
  );
}
