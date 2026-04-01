"use client"

import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const features = [
  {
    title: 'Structured summaries',
    description: 'Turn raw consultation notes into concise, clinician-ready records in seconds.',
  },
  {
    title: 'Actionable follow-ups',
    description: 'Highlight next steps, risks, and care coordination tasks with clear formatting.',
  },
  {
    title: 'Patient communication',
    description: 'Draft patient-friendly follow-up emails without rewriting the same details twice.',
  },
];

const stats = [
  { value: '3', label: 'output views from one note' },
  { value: '<1 min', label: 'from notes to draft' },
  { value: '24/7', label: 'accessible workflow' },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f3ec] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(217,119,6,0.14),_transparent_26%),radial-gradient(circle_at_85%_15%,_rgba(236,72,153,0.10),_transparent_22%),linear-gradient(180deg,_#fbf7f1_0%,_#f3ede5_100%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between rounded-full border border-black/10 bg-white/70 px-5 py-4 shadow-sm backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-700">MediNotes Pro</p>
            <p className="text-sm text-slate-500">AI workflow for modern consultations</p>
          </div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:border-slate-400 hover:bg-slate-50">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-3">
              <Link
                href="/product"
                className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Open workspace
              </Link>
              <UserButton showName={true} />
            </div>
          </SignedIn>
        </nav>

        <section className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
              Built for fast, polished post-consultation documentation
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Better care notes,
              <span className="block text-amber-700">
                designed like a premium product.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Capture the visit once and instantly generate a structured summary, clinician next steps,
              and a patient-friendly follow-up message.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="rounded-full bg-slate-950 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800">
                    Start free trial
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/product"
                  className="rounded-full bg-slate-950 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800"
                >
                  Continue to app
                </Link>
              </SignedIn>
              <Link
                href="/product"
                className="rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-base font-medium text-slate-900 transition hover:bg-white"
              >
                View product
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-black/8 bg-white/70 px-5 py-4 shadow-sm backdrop-blur"
                >
                  <p className="text-2xl font-semibold text-slate-950">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 h-40 w-40 rounded-full bg-amber-300/40 blur-3xl" />
            <div className="absolute -right-8 bottom-6 h-40 w-40 rounded-full bg-rose-300/35 blur-3xl" />
            <div className="relative rounded-[32px] border border-black/10 bg-[#fffaf4] p-5 shadow-[0_25px_80px_rgba(15,23,42,0.12)]">
              <div className="rounded-[28px] border border-black/8 bg-white p-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Consultation Assistant</p>
                    <p className="text-xs text-slate-500">Live workspace preview</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-amber-700">Summary</p>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      Hypertension follow-up documented, medication adherence reviewed, and symptoms
                      remain stable with no urgent concerns raised.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Next steps</p>
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        Repeat blood pressure log, update chart, and schedule a 6-week review.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Patient email</p>
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        Friendly, plain-language recap ready to send after the appointment.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm text-emerald-800">
                      Designed to reduce admin friction while keeping communication professional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-10">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">What you get</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">A warmer, more premium first impression</h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-slate-600">
              A calm, modern interface built to help healthcare professionals move from raw notes to
              usable outputs quickly.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="rounded-[28px] border border-black/8 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white"
              >
                <p className="text-sm text-amber-700">0{index + 1}</p>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}