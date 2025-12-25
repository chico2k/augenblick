import Impressum from "../../components/Impressum";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum - Augenblick Chiemgau",
  description:
    "Augenblick Chiemgau - Wimperverlängerung Lashlift Traunreut Impressum",
};

export default function ImpressumPage() {
  return <Impressum />;
}
