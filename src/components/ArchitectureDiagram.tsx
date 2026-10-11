"use client";

export default function ArchitectureDiagram() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
      <h2 className="text-sm font-semibold text-gray-300">
        System Architecture
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">&#x1f4e7;</div>
          <p className="text-xs font-semibold text-white">Incoming Ticket</p>
          <p className="text-[10px] text-gray-500 mt-1">
            Email / Form / API
          </p>
        </div>

        <div className="hidden md:flex items-center justify-center text-gray-600">
          &#x2192;
        </div>

        <div className="bg-emerald-950 border border-emerald-800 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">&#x26a1;</div>
          <p className="text-xs font-semibold text-emerald-300">
            Jev AI Router
          </p>
          <p className="text-[10px] text-emerald-500 mt-1">
            $0.04/1M tokens
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-[10px] text-emerald-400">
              &#x2713; Intent Classification
            </p>
            <p className="text-[10px] text-emerald-400">
              &#x2713; Urgency Scoring
            </p>
            <p className="text-[10px] text-emerald-400">
              &#x2713; Spam Detection
            </p>
            <p className="text-[10px] text-emerald-400">
              &#x2713; Sentiment Analysis
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center text-gray-600">
          &#x2192;
        </div>

        <div className="space-y-2">
          <div className="bg-blue-950 border border-blue-800 rounded-xl p-3 text-center">
            <p className="text-xs font-semibold text-blue-300">
              OpenRouter Free
            </p>
            <p className="text-[10px] text-blue-500">Auto-Reply (Free)</p>
          </div>
          <div className="bg-orange-950 border border-orange-800 rounded-xl p-3 text-center">
            <p className="text-xs font-semibold text-orange-300">
              Human Agent
            </p>
            <p className="text-[10px] text-orange-500">Escalation</p>
          </div>
          <div className="bg-purple-950 border border-purple-800 rounded-xl p-3 text-center">
            <p className="text-xs font-semibold text-purple-300">
              Spam Filter
            </p>
            <p className="text-[10px] text-purple-500">Blocked (0 tokens)</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-3 mt-4">
        <p className="text-xs text-gray-400 font-semibold mb-2">
          Cost Comparison (per 1M requests)
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-red-400 uppercase mb-1">
              Traditional (LLM for everything)
            </p>
            <p className="text-lg font-bold text-red-400">~$3.00</p>
            <p className="text-[10px] text-gray-500">All tickets hit LLM</p>
          </div>
          <div>
            <p className="text-[10px] text-emerald-400 uppercase mb-1">
              JevRoute (Jev + OpenRouter Free)
            </p>
            <p className="text-lg font-bold text-emerald-400">~$0.04</p>
            <p className="text-[10px] text-gray-500">
              Jev classifies, LLM only when needed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
