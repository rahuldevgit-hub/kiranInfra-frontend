"use client"; // Rupam Singh

import StaticContent from "@/components/StaticContent";
import Header from './(frontend)/header/page'
import Footer from './(frontend)/footer/page'

export default function HomePage() {
  return (
    <>
      <Header />
      <StaticContent slug="home" />
      <Footer />
    </>
  );
}