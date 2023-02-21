import BuchungsForm from "./Form";
import { Element } from "react-scroll";

const BuchungsSection = () => {
  return (
    <Element name="buchung">
      <div className=" bg-white relative max-w-7xl mx-auto sm:py-24 lg:pb-18">
        <h2 className="pl-5 bg-gradient-to-tl from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 text-white text-3xl py-7">
          Buchung
        </h2>
        <h2 className="sr-only">Buchung</h2>
        <div className="bg-fuchsia-50 pl-5  ">
          <BuchungsForm />
        </div>
      </div>
    </Element>
  );
};

export default BuchungsSection;
