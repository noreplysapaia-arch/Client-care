import React, { useState } from 'react';
import {
  Phone,
  PhoneCall,
  Search,
  Filter,
  Play,
  Pause,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  X,
  Volume2,
  FileText,
  User,
  ShieldCheck,
} from 'lucide-react';
import { AICall } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface AICallsPageProps {
  calls: AICall[];
  selectedCall: AICall | null;
  onSelectCall: (call: AICall | null) => void;
  onOpenVoiceDemo: () => void;
}

export const AICallsPage: React.FC<AICallsPageProps> = ({
  calls,
  selectedCall,
  onSelectCall,
  onOpenVoiceDemo,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSentiment, setFilterSentiment] = useState<string>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(35);

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
              {calls.length} Phone Sessions
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Verbatim transcripts, audio playbacks, automated lead scoring, and structured next actions.
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          onClick={onOpenVoiceDemo}
          icon={PhoneCall}
        >
          Make Test Phone Call
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
              {s === 'all' ? 'All Sentiment' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Calls Table */}
      <div className="card-surface rounded-2xl border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#05070E] border-b border-white/[0.06] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Customer & Company</th>
                <th className="py-3.5 px-4">AI Employee</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Intent & Score</th>
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
                  className="hover:bg-white/[0.03] cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white group-hover:text-blue-300 transition-colors">
                      {call.customerName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {call.customerCompany} • {call.customerPhone}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-200">{call.aiEmployeeName}</div>
                    <div className="text-[10px] text-slate-500">{call.aiEmployeeRole}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {call.duration}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200 truncate max-w-[200px]">
                      {call.intent}
                    </div>
                    <span className="text-[10px] text-blue-400 font-bold">
                      Score: {call.leadScore}/100
                    </span>
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCall(call);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold border border-blue-500/20 transition-colors"
                    >
                      Inspect
                    </button>
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
                    <span className="font-semibold text-white">Call Audio Recording</span>
                    <Badge variant="cyan" size="sm">HD Telecom Audio</Badge>
                  </div>
                  <span className="font-mono text-slate-400">{selectedCall.duration}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <div
                    className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden cursor-pointer relative"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pos = (e.clientX - rect.left) / rect.width;
                      setAudioProgress(Math.floor(pos * 100));
                    }}
                  >
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Intelligence Summary & Intent */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Customer Intent
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {selectedCall.intent}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Lead Score
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-extrabold text-cyan-400">
                      {selectedCall.leadScore}
                    </span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Sentiment
                  </span>
                  <Badge
                    variant={
                      selectedCall.sentiment === 'positive' ? 'emerald' : 'blue'
                    }
                    size="sm"
                  >
                    {selectedCall.sentiment}
                  </Badge>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Executive Summary</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedCall.summary}
                </p>
              </div>

              {/* Next Action */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-emerald-300 block mb-0.5">Automated Next Action</span>
                  <p className="text-slate-300">{selectedCall.nextAction}</p>
                </div>
              </div>

              {/* Verbatim Transcript */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Verbatim Audio Transcript
                  </h4>
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
              <span className="text-xs text-slate-500">
                Logged to CRM: <strong>Pramanik Group Master DB</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onSelectCall(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => alert(`Synchronized ${selectedCall.customerName}'s record with HubSpot & Google Calendar.`)}
                >
                  Sync to External CRM
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
