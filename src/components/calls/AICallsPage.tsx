import React, { useState } from 'react';
import {
  Phone,
  PhoneCall,
  Search,
  Clock,
  Sparkles,
  X,
  Volume2,
  FileText,
  Trash2,
} from 'lucide-react';
import { AICall } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface AICallsPageProps {
  calls: AICall[];
  selectedCall: AICall | null;
  onSelectCall: (call: AICall | null) => void;
  onOpenVoiceDemo: () => void;
  onDeleteCall?: (callId: string) => void;
}

export const AICallsPage: React.FC<AICallsPageProps> = ({
  calls,
  selectedCall,
  onSelectCall,
  onOpenVoiceDemo,
  onDeleteCall,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSentiment, setFilterSentiment] = useState<string>('all');

  const filteredCalls = calls.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.intent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.aiEmployeeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSentiment =
      filterSentiment === 'all' || c.sentiment === filterSentiment;

    return matchesSearch && matchesSentiment;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Call Intelligence
            </h1>
            <Badge variant="cyan" size="md">
              {calls.length} Real-Time Call Logs
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Verbatim transcripts, audio playbacks, automated lead scoring, and real-time Firestore synchronization.
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          onClick={onOpenVoiceDemo}
          icon={PhoneCall}
        >
          Make Live Phone Call
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search caller, company, intent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'positive', 'neutral', 'negative'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterSentiment(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                filterSentiment === s
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {s === 'all' ? 'All Sentiments' : `${s} Sentiment`}
            </button>
          ))}
        </div>
      </div>

      {/* CALL LOGS TABLE */}
      <div className="card-surface rounded-2xl border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#05070E] border-b border-white/[0.06] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Caller & Organization</th>
                <th className="py-3.5 px-4">AI Employee</th>
                <th className="py-3.5 px-4">Intent Summary</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Sentiment</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredCalls.map((call) => (
                <tr
                  key={call.id}
                  onClick={() => onSelectCall(call)}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{call.customerName}</div>
                    <div className="text-[11px] text-slate-400">{call.customerCompany}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-200">{call.aiEmployeeName}</span>
                    <span className="block text-[10px] text-slate-500">{call.aiEmployeeRole}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-[260px] truncate" title={call.intent}>
                    {call.intent}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                    {call.duration}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        call.sentiment === 'positive'
                          ? 'emerald'
                          : call.sentiment === 'neutral'
                          ? 'blue'
                          : 'rose'
                      }
                      size="sm"
                    >
                      {call.sentiment}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    {call.timestamp}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectCall(call)}
                        className="px-2.5 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold border border-blue-500/20 transition-colors"
                      >
                        Inspect
                      </button>
                      {onDeleteCall && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete call log for ${call.customerName}?`)) {
                              onDeleteCall(call.id);
                            }
                          }}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete from Firestore"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CALL DETAILS DRAWER / MODAL */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-[#04060B]/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl h-full sm:h-[94vh] sm:rounded-3xl card-surface border-l sm:border border-white/[0.12] shadow-2xl flex flex-col justify-between overflow-hidden bg-[#080B14]">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedCall.customerName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedCall.customerCompany} • Handled by {selectedCall.aiEmployeeName} ({selectedCall.aiEmployeeRole})
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectCall(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Simulated Audio Player Area */}
              <div className="p-4 rounded-2xl bg-[#05070D] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-white">Call Audio Telemetry</span>
                    <Badge variant="cyan" size="sm">HD WebRTC Audio</Badge>
                  </div>
                  <span className="font-mono text-slate-400">{selectedCall.duration}</span>
                </div>
                <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-[45%]" />
                </div>
              </div>

              {/* Call Summary & Key Takeaways */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI Executive Summary</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedCall.summary}
                </p>
                <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-400">
                  <span>Sentiment: <strong className="text-white capitalize">{selectedCall.sentiment}</strong></span>
                  <span>Next Action: <strong className="text-cyan-400">{selectedCall.nextAction}</strong></span>
                </div>
              </div>

              {/* Verbatim Transcript */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <h4>Transcript & Dialogue</h4>
                </div>

                <div className="space-y-2.5">
                  {selectedCall.transcript.map((line, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        line.speaker === 'ai'
                          ? 'bg-blue-950/30 border border-blue-500/20 text-slate-200 mr-6'
                          : 'bg-white/[0.03] border border-white/[0.06] text-slate-300 ml-6'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-semibold mb-1">
                        <span className={line.speaker === 'ai' ? 'text-blue-400' : 'text-slate-400'}>
                          {line.speaker === 'ai'
                            ? `${selectedCall.aiEmployeeName} (AI Employee)`
                            : selectedCall.customerName}
                        </span>
                        <span className="text-slate-500 font-mono">{line.time}</span>
                      </div>
                      <p>{line.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-white/[0.08] flex items-center justify-between gap-3 bg-white/[0.02]">
              {onDeleteCall && (
                <button
                  onClick={() => {
                    if (confirm(`Delete this call record permanently?`)) {
                      onDeleteCall(selectedCall.id);
                      onSelectCall(null);
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Call Log</span>
                </button>
              )}
              <Button variant="outline" size="sm" onClick={() => onSelectCall(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
