import { BRANCHES, directionsUrl, hasAddress } from "@/config/branches";
import { BRAND } from "@/config/content";
import { FOUNDER } from "@/config/founder";
import { AngularButton, MaskHeading, OutlineTitle, RevealText, SectionLabel, SpotlightCard } from "@/components/ui";
import { useBooking } from "@/components/BookingProvider";

export default function Contact() {
  const { open } = useBooking();
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-20">
      <SectionLabel>Get in touch</SectionLabel>
      <OutlineTitle text="CONTACT" className="mt-4 text-[clamp(2.2rem,11vw,9rem)]" />
      <RevealText className="mt-8 max-w-xl text-[15px] leading-relaxed text-silver-dim">
        Call us, drop by any branch, or send a booking request and our team will call you back within 24 hours.
      </RevealText>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        <SpotlightCard className="p-7">
          <h3 className="font-[Syncopate] text-sm font-bold text-white">DIRECT</h3>
          <div className="mt-5 space-y-3 text-[14px] text-silver-dim">
            <div><a href={`tel:${BRAND.phone}`} className="text-violet-200 hover:text-white">{BRAND.phone}</a></div>
            <div><a href={`mailto:${BRAND.email}`} className="hover:text-white">{BRAND.email}</a></div>
            <div><a href={FOUNDER.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white">facebook.com/mubafitnesss</a></div>
          </div>
          <div className="mt-7">
            <AngularButton variant="solid" onClick={() => open({})}>Book a Session</AngularButton>
          </div>
        </SpotlightCard>

        {BRANCHES.map((b) => (
          <SpotlightCard key={b.slug} className="p-7">
            <h3 className="font-[Syncopate] text-sm font-bold text-white">{b.name.toUpperCase()}</h3>
            <p className="mt-4 text-[13px] leading-relaxed text-silver-dim">
              {hasAddress(b) ? b.address : "Address coming soon"}
            </p>
            <div className="mt-4 text-[11px] tracking-[0.2em] text-violet-300 uppercase">{b.hours}</div>
            {hasAddress(b) && (
              <div className="mt-6">
                <AngularButton href={directionsUrl(b)}>Get Directions</AngularButton>
              </div>
            )}
          </SpotlightCard>
        ))}
      </div>

      <div className="mt-16">
        <MaskHeading className="font-[Syncopate] text-[clamp(1.2rem,3vw,2rem)] font-bold text-white">
          Opening hours: 6:00 AM – 11:00 PM, every day.
        </MaskHeading>
      </div>
    </div>
  );
}
