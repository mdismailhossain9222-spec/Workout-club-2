import { useEffect } from "react";
import { FOUNDER } from "@/config/founder";
import { BRAND } from "@/config/content";
import { BRANCHES, hasAddress } from "@/config/branches";

/** Person + Organization JSON-LD and Open Graph tags injected on mount. */
export default function Seo() {
  useEffect(() => {
    document.title = `${BRAND.name} — Premium Gym in Dhaka | 25% OFF Memberships`;

    const meta = (attr: "name" | "property", key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const desc = `${BRAND.name} — gym, classes and recovery across Mirpur DOHS, Banani and Bashundhara. Founded by ${FOUNDER.name}. 25% OFF memberships now.`;
    meta("name", "description", desc);
    meta("property", "og:title", `${BRAND.name} — Train Sharp. Stay Club.`);
    meta("property", "og:description", desc);
    meta("property", "og:type", "website");
    meta("property", "og:image", FOUNDER.photos[0]);
    meta("name", "twitter:card", "summary_large_image");
    meta("name", "theme-color", "#06030d");

    const ld = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          name: BRAND.name,
          telephone: BRAND.phone,
          email: BRAND.email,
          sameAs: [FOUNDER.facebook],
          founder: {
            "@type": "Person",
            name: FOUNDER.name,
            jobTitle: FOUNDER.role,
            description: FOUNDER.quote,
            sameAs: [FOUNDER.facebook],
          },
          location: BRANCHES.filter(hasAddress).map((b) => ({
            "@type": "ExerciseGym",
            name: `${BRAND.name} — ${b.name}`,
            telephone: b.phone,
            address: { "@type": "PostalAddress", streetAddress: b.address, addressLocality: "Dhaka", addressCountry: "BD" },
          })),
        },
        {
          "@type": "Person",
          name: FOUNDER.name,
          jobTitle: FOUNDER.role,
          worksFor: { "@type": "Organization", name: BRAND.name },
          sameAs: [FOUNDER.facebook],
        },
      ],
    };
    let script = document.getElementById("twc-ld") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "twc-ld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(ld);
  }, []);
  return null;
}
