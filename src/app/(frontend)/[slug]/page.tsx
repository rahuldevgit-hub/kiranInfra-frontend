// app/[slug]/page.tsx

import StaticPage from "@/components/StaticContent";
import Header from "../header/page";
import Footer from "../footer/page";

// Example: list all slugs at build time
export async function generateStaticParams() {
  // Replace this with real slugs from API or CMS
  const slugs = ["home", "about", "contact"];
  return slugs.map(slug => ({ slug }));
}

// params is typed as { slug: string } now
export default function SlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <>
      <Header />
      <StaticPage slug={slug} />
      <Footer />
    </>
  );
}
