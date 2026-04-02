import { PricingTable, Protect, useAuth, UserButton } from '@clerk/nextjs';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import DatePicker from 'react-datepicker';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

const workspaceHighlights = [
    'Generate structured records, follow-up actions, and patient messaging in one pass.',
    'Keep notes readable and professional with a clean split between input and output.',
    'Use the same workflow for fast consult summaries across repeated appointments.',
];

const premiumBenefits = [
    'Unlimited AI-assisted consultation summaries',
    'Professional formatting for clinician and patient outputs',
    'Secure workflow designed for healthcare teams',
];

function ConsultationForm() {
    const { getToken } = useAuth();
    const [patientName, setPatientName] = useState('');
    const [visitDate, setVisitDate] = useState<Date | null>(new Date());
    const [notes, setNotes] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setOutput('');
        setLoading(true);

        const jwt = await getToken();
        if (!jwt) {
            setOutput('Authentication required');
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        let buffer = '';

        await fetchEventSource('/api/consultation', {
            signal: controller.signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
                patient_name: patientName,
                date_of_visit: visitDate?.toISOString().slice(0, 10),
                notes,
            }),
            onmessage(ev) {
                buffer += ev.data;
                setOutput(buffer);
            },
            onclose() { 
                setLoading(false); 
            },
            onerror(err) {
                console.error('SSE error:', err);
                controller.abort();
                setLoading(false);
            },
        });
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Consultation workspace</p>
                    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                        Create polished follow-up documentation from a single set of notes.
                    </h1>
                    <p className="mt-4 text-base leading-7 text-slate-300">
                        Enter the visit details once to produce a structured summary, recommended next
                        steps, and a patient-ready email draft.
                    </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                    {['Clinician summary', 'Next steps', 'Patient email'].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 backdrop-blur"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
                <div className="space-y-6">
                    <aside className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
                        <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Workflow</p>
                        <div className="mt-4 space-y-4">
                            {workspaceHighlights.map((item) => (
                                <div key={item} className="rounded-2xl border border-white/8 bg-slate-950/40 p-4">
                                    <p className="text-sm leading-6 text-slate-200">{item}</p>
                                </div>
                            ))}
                        </div>
                    </aside>

                    <form
                        onSubmit={handleSubmit}
                        className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-emerald-950/20 backdrop-blur"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Input</p>
                                <h2 className="mt-2 text-2xl font-semibold text-white">Consultation details</h2>
                            </div>
                            <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                                {loading ? 'Generating...' : 'Ready'}
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-1">
                                <label htmlFor="patient" className="block text-sm font-medium text-slate-300">
                                    Patient name
                                </label>
                                <input
                                    id="patient"
                                    type="text"
                                    required
                                    value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/8"
                                    placeholder="Enter patient full name"
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-1">
                                <label htmlFor="date" className="block text-sm font-medium text-slate-300">
                                    Visit date
                                </label>
                                <DatePicker
                                    id="date"
                                    selected={visitDate}
                                    onChange={(d: Date | null) => setVisitDate(d)}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Select date"
                                    required
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/8"
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <label htmlFor="notes" className="block text-sm font-medium text-slate-300">
                                    Consultation notes
                                </label>
                                <textarea
                                    id="notes"
                                    required
                                    rows={10}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/8"
                                    placeholder="Include symptoms, observations, medications, plan, and follow-up context..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                            {loading ? 'Generating summary...' : 'Generate consultation draft'}
                        </button>
                    </form>
                </div>

                <section className="rounded-[32px] border border-white/10 bg-slate-950/45 p-6 backdrop-blur">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Output</p>
                            <h2 className="mt-2 text-2xl font-semibold text-white">Generated response</h2>
                        </div>
                        <div className="rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs text-teal-200">
                            Markdown formatted
                        </div>
                    </div>

                    {output ? (
                        <div className="markdown-content prose prose-invert prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white max-w-none pt-6">
                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                {output}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <div className="flex min-h-[420px] flex-col justify-between pt-6">
                            <div className="rounded-[28px] border border-dashed border-white/15 bg-slate-950/35 p-6">
                                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Preview state</p>
                                <h3 className="mt-3 text-xl font-semibold text-white">Your generated note will appear here</h3>
                                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                                    Submit the consultation form to stream a summary for the doctor&apos;s
                                    records, a list of next steps, and a patient-friendly email draft.
                                </p>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                {['Summary', 'Tasks', 'Email'].map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default function Product() {
    return (
        <main className="min-h-screen overflow-hidden bg-[#06121f] text-slate-100">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_28%),radial-gradient(circle_at_85%_15%,_rgba(20,184,166,0.12),_transparent_20%),linear-gradient(180deg,_#071711_0%,_#020617_100%)]" />
            <div className="relative">
                <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">MediNotes Pro</p>
                        <p className="mt-1 text-sm text-slate-400">Consultation drafting workspace</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                        >
                            Back home
                        </Link>
                        <div className="rounded-full border border-white/10 bg-white/5 px-2 py-1 backdrop-blur">
                            <UserButton showName={true} />
                        </div>
                    </div>
                </header>
            </div>

            <Protect
                plan="premium_subscription"
                fallback={
                    <div className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                            <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
                                <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Premium access</p>
                                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                                    Unlock the full consultation drafting workspace.
                                </h1>
                                <p className="mt-4 text-base leading-7 text-slate-300">
                                    Upgrade to generate polished summaries and patient-ready communication
                                    in a clean modern interface built for fast clinical workflows.
                                </p>

                                <div className="mt-8 space-y-3">
                                    {premiumBenefits.map((item) => (
                                        <div
                                            key={item}
                                            className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-200"
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="rounded-[32px] border border-white/10 bg-slate-950/50 p-6 backdrop-blur">
                                <div className="mb-6">
                                    <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Plans</p>
                                    <h2 className="mt-2 text-2xl font-semibold text-white">
                                        Choose the healthcare professional plan
                                    </h2>
                                </div>
                                <div className="max-w-4xl">
                                    <PricingTable />
                                </div>
                            </div>
                        </div>
                    </div>
                }
            >
                <ConsultationForm />
            </Protect>
        </main>
    );
}