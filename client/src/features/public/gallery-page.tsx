import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PublicPageRenderer } from "@/features/public/public-block-renderer";
import { GLASS_GALLERY_FALLBACK_BLOCKS } from "@shared/glass-gallery-fallback";

export default function GalleryPage() {
  return (
    <div className="public-page-shell min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <PublicPageRenderer blocks={GLASS_GALLERY_FALLBACK_BLOCKS} />
      </main>
      <Footer />
    </div>
  );
}
