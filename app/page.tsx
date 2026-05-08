import Link from "next/link";
import { PageBody } from "@/components/PageBody";

export default function LandingPage() {
  return (
    <PageBody className="items-center justify-between gap-8 text-center">
      <div className="flex flex-1 flex-col items-center justify-center">
        <h2 className="text-5xl leading-[0.95] font-extrabold tracking-tight uppercase">
          <span className="block">Turn Your</span>
          <span className="mt-2 block text-primary">Cruise</span>
          <span className="mt-2 block">Into Your</span>
          <span className="mt-2 block text-primary">Song</span>
        </h2>

        <p className="mt-10 text-lg font-bold">VALUED AT $150</p>
        <p className="text-sm text-muted">(yours for free!)</p>

        <Link
          href="/home"
          className="mt-10 inline-flex items-center justify-center rounded-md bg-primary px-12 py-3 text-sm font-bold tracking-wide text-primary-foreground uppercase transition-colors hover:bg-primary/90"
        >
          Let&rsquo;s Go!
        </Link>
      </div>
    </PageBody>
  );
}
