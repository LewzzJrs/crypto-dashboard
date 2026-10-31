import type { Metadata } from "next";
import { ConverterView } from "@/components/ConverterView";

export const metadata: Metadata = { title: "Converter" };

export default function ConverterPage() {
  return <ConverterView />;
}
