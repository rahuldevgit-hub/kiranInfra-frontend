"use client"

import { use } from "react";
import StaticPage from "@/components/StaticContent";
import Header from "../header/page";
import Footer from "../footer/page";


export default function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params); // unwrap promise ✅
  return <>
    <Header />
    <StaticPage slug={slug} />
    <Footer />
  </>;
}