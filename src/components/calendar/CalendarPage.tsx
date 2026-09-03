import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  PhoneCall,
  Plus,
  Video,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Appointment } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface CalendarPageProps {
  appointments: Appointment[];
  onOpenVoiceDemo: () => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({
  appointments,
  onOpenVoiceDemo,
}) => {
  const [viewTab, setViewTab] = useState<'upcoming' | 'week'>('upcoming');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Booked Appointments
            </h1>
            <Badge variant="emerald" size="md">
              {appointments.length} Scheduled
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Zero-touch meetings scheduled automatically by your AI phone and web workforce.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={onOpenVoiceDemo}
            icon={PhoneCall}
          >
            Test Scheduling Call
          </Button>
          <Button
            variant="gradient"
            size="md"
            onClick={() => alert('Synced with Google Calendar and Microsoft Outlook for Pramanik Group.')}
            icon={CalendarIcon}
          >
            Sync Google Calendar
          </Button>
        </div>
      </div>

      {/* Calendar Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-surface p-5 rounded-2xl border border-white/[0.08] shadow-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Confirmed This Week
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">18</span>
            <span className="text-xs text-emerald-400 font-semibold">+4 vs last week</span>
          </div>
        </div>

        <div className="card-surface p-5 rounded-2xl border border-white/[0.08] shadow-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            AI Booking Success Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-cyan-400">93.4%</span>
            <span className="text-xs text-slate-400">Zero double-bookings</span>
          </div>
        </div>

        <div className="card-surface p-5 rounded-2xl border border-white/[0.08] shadow-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Avg Time-to-Schedule
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-400">1m 45s</span>
            <span className="text-xs text-slate-400">during live call</span>
          </div>
        </div>
      </div>

      {/* Appointment Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <h3 className="text-sm font-bold text-white">Upcoming Executive Sessions</h3>
          <span className="text-xs text-slate-400">Timezone: America/New_York (EDT)</span>
        </div>

        <div className="space-y-3.5">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="card-surface rounded-2xl p-5 border border-white/[0.08] hover:border-blue-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex-shrink-0">
                  <Video className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{appt.title}</h4>
                    <Badge variant={appt.status === 'scheduled' ? 'emerald' : 'blue'} size="sm">
                      {appt.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-300">
                    Client: <strong>{appt.customerName}</strong> ({appt.customerCompany})
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-200 font-mono">{appt.date} at {appt.time}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>Booked by AI Employee <strong>{appt.aiEmployeeName}</strong></span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
                <button
                  onClick={() => alert(`Meeting link: https://meet.google.com/ccc-prmk-${appt.id}`)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-colors"
                >
                  Join Google Meet
                </button>
                <button
                  onClick={() => alert(`Reschedule request initiated for ${appt.customerName}.`)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium border border-white/[0.06] transition-colors"
                >
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
