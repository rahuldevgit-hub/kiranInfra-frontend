// app/[slug]/page.tsx
import StaticContent from "@/components/StaticContent";
import Header from "../header/page";
import Footer from "../footer/page";

// List all slugs to generate static pages at build time
export async function generateStaticParams() {
  // Replace with API call if needed
  const slugs = ["home", "about", "contact"];
  return slugs.map(slug => ({ slug }));
}

type Props = {
  params: { slug: string };
};

export default function SlugPage({ params }: Props) {
  const { slug } = params;

  return (
    <>
      <Header />
      <StaticContent slug={slug} />
      <Footer />
    </>
  );
}
