import { getHeroSlides } from "@/app/actions/admin/hero";
import HeroSlidesList from "@/components/admin/slide/HeroSlidesList";

export default async function HeroSlidesPage() {
  const slides = await getHeroSlides();

  return <HeroSlidesList initialSlides={slides} />;
}
