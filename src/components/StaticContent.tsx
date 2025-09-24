"use client";

import { useEffect, useState } from "react";
import { findStaticByTitle } from "@/services/static.service";
import Loader from "@/components/ui/loader";
import NotFoundPage from "@/app/not-found";

export default function StaticPage({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(true);
  const [isContent, setIsContent] = useState("");
  const [notFoundPage, setNotFoundPage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: any = await findStaticByTitle(slug);
        if (res?.result?.content) {
          setIsContent(res.result.content);
        } else {
          setNotFoundPage(true);
        }
      } catch (error) {
        setNotFoundPage(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  if (notFoundPage) {
    return <div className="mt-32">
      <NotFoundPage />
    </div>; // ✅ render custom 404
  }
  return (
    <div
      className="prose prose-sm max-w-full text-black lg:pt-[140px] pt-[100px] px-[80px] pb-[40px]"
      dangerouslySetInnerHTML={{ __html: isContent }}
    />
  );
}
