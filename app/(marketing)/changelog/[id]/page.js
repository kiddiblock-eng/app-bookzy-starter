import { versions } from "@/data/changelog";
import { notFound } from "next/navigation";
import VersionDetail from "./Components/VersionDetail";

export async function generateStaticParams() {
  return versions.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }) {
  const version = versions.find((v) => v.id === params.id);
  if (!version) return {};
  return {
    title: `Bookzy V${version.version} ${version.name} — Détails des changements`,
    description: version.summary,
  };
}

export default function VersionPage({ params }) {
  const version = versions.find((v) => v.id === params.id);
  if (!version) notFound();
  return <VersionDetail version={version} />;
}