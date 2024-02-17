import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Link } from "react-scroll";

import { useState } from "react";

const Elternzeit = () => {
  const [openModal, setOpenModal] = useState(true);
  return (
    <div>
      {typeof window !== "undefined" && (
        <Dialog
          modal={true}
          open={openModal}
          onOpenChange={(status) => setOpenModal(status)}
        >
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="px mb-4 text-4xl text-fuchsia-500">
                Auszeit
              </DialogTitle>
              <DialogDescription className="text-lg ">
                Liebe Kundinnen, <br /> ich warte derzeit auf unser Baby und
                werde anschließend in Elternzeit gehen. Daher kann ich momentan
                keine Termine vergeben. Eure Geduld und Verständnis bedeuten mir
                viel. Tragt euch gerne in meinen Newsletter ein, um zu erfahren,
                wann ich wieder verfügbar bin. Danke für eure Unterstützung!
                <p className="mt-4 text-fuchsia-500">
                  Herzliche Grüße, <br />
                  Sandra{" "}
                </p>
                <Link
                  to={"newsletter"}
                  spy={true}
                  smooth={true}
                  duration={500}
                  href="/"
                >
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="hbover:via-fuchsia-800 mt-6 inline-flex cursor-pointer items-center rounded-md border 
                             border-transparent bg-gradient-to-tl from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 px-4 py-2 text-xl font-medium text-white shadow-sm transition-all
                                duration-300 ease-in-out hover:bg-gradient-to-l hover:from-fuchsia-900
                             hover:to-fuchsia-900 focus:outline-none focus:ring-2 focus:ring-indigo-500  focus:ring-offset-2 md:px-6 md:text-2xl"
                  >
                    Zum Newsletter
                  </button>
                </Link>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Elternzeit;
