"use client";

import { useState } from "react";

const DEFAULT_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function BackendCheckPage() {
  const [backendUrl, setBackendUrl] = useState(DEFAULT_BACKEND_URL);
  const [loading, setLoading] = useState(false);
  const [healthPayload, setHealthPayload] = useState<Record<string, unknown> | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [jobId, setJobId] = useState("");
  const [jobStatus, setJobStatus] = useState<string | null>(null);

  const fetchJson = async (url: string) => {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || response.statusText || "Request failed");
    }
    return response.json();
  };

  const runHealthCheck = async () => {
    setLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const data = await fetchJson(`${backendUrl}/health`);
      setHealthPayload(data);
      setStatusMessage("Backend is reachable.");
    } catch (error) {
      setHealthPayload(null);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const runDemo = async (scenario: "healthy" | "collapsing") => {
    setLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);
    setJobStatus(null);
    try {
      const data = await fetchJson(`${backendUrl}/api/v1/demo/analyze/${scenario}`);
      setHealthPayload(data);
      setStatusMessage(`Started demo job: ${data.job_id ?? "unknown"}`);
      if (data.job_id) setJobId(String(data.job_id));
    } catch (error) {
      setHealthPayload(null);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const checkJobStatus = async () => {
    if (!jobId) {
      setErrorMessage("Enter a job ID first.");
      return;
    }
    setLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const data = await fetchJson(`${backendUrl}/api/v1/jobs/${jobId}/status`);
      setJobStatus(String(data.status ?? "unknown"));
      setStatusMessage("Job status retrieved.");
    } catch (error) {
      setJobStatus(null);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/20">
        <h1 className="text-3xl font-semibold text-white">Backend health check</h1>
        <p className="mt-2 text-slate-400">
          Use this page to verify the backend and kick off a demo analysis job.
        </p>

        <div className="mt-8 space-y-6">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="block text-sm text-slate-300">
              Backend URL
              <input
                value={backendUrl}
                onChange={(event) => setBackendUrl(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                placeholder="http://localhost:8000"
              />
            </label>
            <button
              type="button"
              onClick={runHealthCheck}
              disabled={loading}
              className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Checking…" : "Check health"}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => runDemo("healthy")}
              disabled={loading}
              className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Run healthy demo
            </button>
            <button
              type="button"
              onClick={() => runDemo("collapsing")}
              disabled={loading}
              className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Run collapsing demo
            </button>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <label className="block text-sm text-slate-300">
                Job ID
                <input
                  value={jobId}
                  onChange={(event) => setJobId(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                  placeholder="Paste job id from demo response"
                />
              </label>
              <button
                type="button"
                onClick={checkJobStatus}
                disabled={loading || !jobId}
                className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Check job status
              </button>
            </div>
            {jobStatus ? (
              <p className="mt-4 text-sm text-slate-200">Current status: {jobStatus}</p>
            ) : null}
          </div>

          {(statusMessage || errorMessage) && (
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
              {statusMessage ? (
                <p className="text-slate-100">{statusMessage}</p>
              ) : null}
              {errorMessage ? (
                <p className="mt-2 text-sm text-rose-300">{errorMessage}</p>
              ) : null}
            </div>
          )}

          {healthPayload ? (
            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/90 p-5 text-sm text-slate-200">
              <pre>{JSON.stringify(healthPayload, null, 2)}</pre>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
