"use client"

import { useAuth, UserButton } from '@clerk/nextjs';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

const INDUSTRIES = [
    { id: 'AI agents',        label: 'AI Agents' },
    { id: 'healthcare',       label: 'Healthcare' },
    { id: 'finance',          label: 'Finance' },
    { id: 'education',        label: 'Education' },
    { id: 'retail',           label: 'Retail' },
    { id: 'tech industry',    label: 'Tech Industry' },
    { id: 'AI-powered tools', label: 'AI-Powered Tools' },
];

const STORAGE_KEY = 'ideagen_history';
const MAX_HISTORY = 20;

interface SavedIdea {
    id: string;
    industry: string;
    content: string;
    timestamp: number;
}

function loadHistory(): SavedIdea[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
        return [];
    }
}

function saveToHistory(idea: SavedIdea): SavedIdea[] {
    const updated = [idea, ...loadHistory()].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
}

function stripMarkdown(text: string): string {
    return text.replace(/[#*_`>\-]/g, '').replace(/\s+/g, ' ').trim();
}

function IdeaGenerator() {
    const { getToken } = useAuth();
    const [idea, setIdea]               = useState<string>('');
    const [industry, setIndustry]       = useState<string>('AI agents');
    const [loading, setLoading]         = useState(false);
    const [copied, setCopied]           = useState(false);
    const [history, setHistory]         = useState<SavedIdea[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        setHistory(loadHistory());
    }, []);

    const generate = useCallback(async () => {
        setLoading(true);
        let buffer = '';

        const jwt = await getToken();
        if (!jwt) {
            setIdea('Authentication required');
            setLoading(false);
            return;
        }

        try {
            await fetchEventSource(`/api?industry=${encodeURIComponent(industry)}`, {
                headers: { Authorization: `Bearer ${jwt}` },
                onmessage(ev) {
                    buffer += ev.data;
                    setIdea(buffer);
                },
                onerror(err) {
                    console.error('SSE error:', err);
                    throw err; // stop retrying
                },
            });

            if (buffer) {
                const saved = saveToHistory({
                    id: crypto.randomUUID(),
                    industry,
                    content: buffer,
                    timestamp: Date.now(),
                });
                setHistory(saved);
            }
        } catch (err) {
            console.error('Generation failed:', err);
        } finally {
            setLoading(false);
        }
    }, [getToken, industry]);

    const copyToClipboard = useCallback(async () => {
        await navigator.clipboard.writeText(idea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [idea]);

    const loadFromHistory = useCallback((item: SavedIdea) => {
        setIdea(item.content);
        setIndustry(item.industry);
    }, []);

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <header className="text-center mb-12">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    Business Idea Generator
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    AI-powered innovation at your fingertips
                </p>
            </header>

            <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                <div className="space-y-6">
                    {/* Controls */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Industry / Domain
                        </p>
                        <div className="mb-5 overflow-x-auto">
                            <div className="flex w-max min-w-full gap-1.5 whitespace-nowrap xl:w-full xl:justify-between">
                                {INDUSTRIES.map((ind) => (
                                    <button
                                        key={ind.id}
                                        onClick={() => setIndustry(ind.id)}
                                        className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                                            industry === ind.id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {ind.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={generate}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all"
                        >
                            {loading ? 'Generating…' : idea ? 'Regenerate' : 'Generate Idea'}
                        </button>
                    </div>

                    {/* Content card */}
                    {idea && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                                    {industry}
                                </span>
                                <button
                                    onClick={copyToClipboard}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    {copied ? '✓ Copied!' : 'Copy'}
                                </button>
                            </div>
                            <div className="markdown-content text-gray-700 dark:text-gray-300">
                                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                    {idea}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>

                {/* History panel */}
                {history.length > 0 && (
                    <div className="xl:pt-0">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 xl:sticky xl:top-8">
                            <button
                                onClick={() => setShowHistory((v) => !v)}
                                className="flex justify-between items-center w-full text-left"
                            >
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                    Recent Ideas ({history.length})
                                </span>
                                <span className="text-gray-400 text-sm">{showHistory ? '▲' : '▼'}</span>
                            </button>

                            {showHistory && (
                                <div className="mt-4 space-y-2">
                                    {history.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => loadFromHistory(item)}
                                            className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 capitalize">
                                                    {item.industry}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(item.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                                {stripMarkdown(item.content).slice(0, 120)}…
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Product() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {/* User Menu in Top Right */}
            <div className="absolute top-4 right-4">
                <UserButton showName={true} />
            </div>

            <IdeaGenerator />
        </main>
    );
}
