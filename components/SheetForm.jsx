"use client";

import { useState } from "react";
import { extractSheetId, extractGid } from "@/lib/parseSheet";

export default function SheetForm({ onLoad }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const sheetId = extractSheetId(url.trim());
    if (!sheetId) {
      setError("Couldn't extract a Sheet ID from that URL. Please paste the full Google Sheets link.");
      return;
    }

    const gid = extractGid(url.trim());
    setLoading(true);

    try {
      const res = await fetch(`/api/fetch-sheet?sheetId=${sheetId}&gid=${gid}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const csv = await res.text();
      onLoad({ csv, sheetId, gid, url: url.trim() });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--bg-base)" }}>
      {/* Background grain */}
      <div className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative w-full max-w-xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono text-amber-400 tracking-widest uppercase">Content Analytics</span>
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-ink-50 mb-3">
            Sheet Dashboard
          </h1>
          <p className="text-ink-400 text-sm leading-relaxed max-w-sm mx-auto">
            Connect your Google Sheet to instantly generate client, editor & writer analytics with live filters.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-subtle p-8"
          style={{ background: "var(--bg-surface)" }}>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-widest mb-2">
                Google Sheet URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(""); }}
                placeholder="https://docs.google.com/spreadsheets/d/…"
                className="w-full px-4 py-3 rounded-xl text-sm font-mono text-ink-100 placeholder:text-ink-600
                  focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="w-full py-3 px-6 rounded-xl font-semibold text-sm text-ink-950 transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed
                hover:brightness-110 active:scale-[0.98]"
              style={{ background: loading ? "#6e6a5a" : "var(--amber)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                      strokeDasharray="60" strokeDashoffset="20" />
                  </svg>
                  Loading sheet…
                </span>
              ) : "Load Dashboard →"}
            </button>
          </form>

          {/* Instructions */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs text-ink-500 font-mono uppercase tracking-widest mb-3">Required setup</p>
            <ol className="space-y-2">
              {[
                "Open your Google Sheet",
                'Click Share → "Anyone with the link" → Viewer',
                "Copy & paste the URL above",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-ink-400">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-amber-400 font-mono font-bold"
                    style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Column hint */}
        <div className="mt-5 px-4 py-3 rounded-xl border" style={{ borderColor: "var(--border)", background: "rgba(26,25,22,0.5)" }}>
          <p className="text-xs font-mono text-ink-500 mb-2">Expected columns:</p>
          <div className="flex flex-wrap gap-1.5">
            {["Editor","Date","Client Code","Client Name","Emp ID","Writer Name",
              "Content Type","Word Count","Approved WC","Revision WC","Status","Remarks"].map(col => (
              <span key={col} className="px-2 py-0.5 rounded text-xs font-mono text-amber-400"
                style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
                {col}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
