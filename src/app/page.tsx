import Nav from "@/components/Nav";
import OfferLab from "@/components/OfferLab";
import Method from "@/components/Method";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Offer Lab",
  url: "https://offer-lab-ivory.vercel.app/",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free calculator for new graduates: take-home pay after 2026 federal, state and city taxes, typical rent (alone or shared), electricity and everyday costs, and what is left each month, for 75 US cities. Compare two job offers.",
  publisher: { "@type": "Organization", name: "Cense", url: "https://cense.beehiiv.com" },
};

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main" className="w-full flex-1 px-4 sm:px-6">
        <OfferLab />
      </main>
      <Method />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
    </>
  );
}
