// src/components/StaticContent.tsx
import { findStaticByTitle } from "@/services/static.service";
import NotFoundPage from "@/app/not-found";

type Props = {
  slug: string;
};

export default async function StaticContent({ slug }: Props) {
  // Fetch content at build time or server-side
  const data = await findStaticByTitle(slug);

  if (!data) return <NotFoundPage />;

  return (
    <div>
      <h1>{data.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
    </div>
  );
}
