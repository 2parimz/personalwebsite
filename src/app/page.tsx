import { LayeredPages } from "@/components/mag/LayeredPages";
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
    <LayeredPages>
      <CoverPage />
      <AboutPage />
      <SoundPage />
      <ObsessionsPage />
      <FeaturePage />
      <TablePage />
      <ColophonPage />
    </LayeredPages>
  );
}
