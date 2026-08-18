import { PageDeck } from "@/components/mag/PageDeck";
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
    <PageDeck>
      <CoverPage />
      <AboutPage />
      <SoundPage />
      <ObsessionsPage />
      <FeaturePage />
      <TablePage />
      <ColophonPage />
    </PageDeck>
  );
}
