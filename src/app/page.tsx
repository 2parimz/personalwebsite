import { HorizontalPages } from "@/components/mag/HorizontalPages";
import {
  AboutPage,
  ColophonPage,
  CoverPage,
  FeaturePage,
  ObsessionsPage,
  SoundPage,
  TablePage,
} from "@/components/mag/pages";

export default function Home() {
  return (
    <HorizontalPages>
      <CoverPage />
      <AboutPage />
      <SoundPage />
      <ObsessionsPage />
      <FeaturePage />
      <TablePage />
      <ColophonPage />
    </HorizontalPages>
  );
}
