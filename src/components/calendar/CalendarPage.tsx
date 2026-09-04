import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Sparkles,
  PhoneCall,
  Plus,
  Trash2,
} from 'lucide-react';
import { Appointment } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface CalendarPageProps {
  appointments: Appointment[];
  onOpenVoiceDemo: () => void;
  onAddAppointment?: (apt: Appointment) => void;
  onUpdateAppointmentStatus?: (id: string, status: Appointment['status']) => void;
  onDeleteAppointment?: (id: string) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({
  appointments,
  onOpenVoiceDemo,
  onAddAppointment,
  onUpdateAppointmentStatus,
  onDeleteAppointment,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [date, setDate] = useState('Tomorrow, 3:00 PM');
  const [aiEmployeeName, setAiEmployeeName] = useState('Sarah');

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !customerName) return;

    const newApt: Appointment = {
      id: `apt_${Date.now()}`,
      title,
      customerName,
      customerCompany: customerCompany || 'Enterprise Prospect',
      customerEmail: `${customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      aiEmployeeName,
      date,
      time: '3:00 PM - 3:30 PM EDT',
      duration: '30 mins',
      status: 'confirmed',
      type: 'ai-booked',
      meetingLink: `https://meet.clientcare.ai/room-${Date.now().toString().slice(-4)}`,
    };

    if (onAddAppointment) onAddAppointment(newApt);
    setIsModalOpen(false);
    setTitle('');
    setCustomerName('');
    setCustomerCompany('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Calendar & Bookings
            </h1>
            <Badge variant="emerald" size="md">
              {appointments.length} Real-Time Sessions
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Zero-touch meetings scheduled automatically by your AI phone workforce and synced to Firestore.
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
            onClick={() => setIsModalOpen(true)}
            icon={Plus}
          >
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Calendar Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-surface p-5 rounded-2xl border border-white/[0.08] shadow-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Active Appointments
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{appointments.length}</span>
            <span className="text-xs text-emerald-400 font-semibold">Live in Firestore</span>
          </div>
        </div>

        <div className="card-surface p-5 rounded-2xl border border-white/[0.08] shadow-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            AI Booking Success Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-cyan-400">98.2%</span>
            <span className="text-xs text-slate-400">Zero double-bookings</span>
          </div>
        </div>

        <div className="card-surface p-5 rounded-2xl border border-white/[0.08] shadow-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Avg Time-to-Schedule
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-400">1m 15s</span>
            <span className="text-xs text-slate-400">during live call</span>
          </div>
        </div>
      </div>

      {/* Appointment Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <h3 className="text-sm font-bold text-white">Executive Sessions & Demonstrations</h3>
          <span className="text-xs text-slate-400">Real-time Cloud Sync Active</span>
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
                    <select
                      value={appt.status}
                      onChange={(e) =>
                        onUpdateAppointmentStatus &&
                        onUpdateAppointmentStatus(appt.id, e.target.value as Appointment['status'])
                      }
                      className="bg-white/[0.06] border border-white/[0.1] text-[11px] text-white rounded-lg px-2 py-0.5 focus:outline-none focus:border-cyan-500 capitalize"
                    >
                      <option value="confirmed" className="bg-[#0b0f19]">confirmed</option>
                      <option value="scheduled" className="bg-[#0b0f19]">scheduled</option>
                      <option value="completed" className="bg-[#0b0f19]">completed</option>
                      <option value="cancelled" className="bg-[#0b0f19]">cancelled</option>
                    </select>
                  </div>

                  <p className="text-xs text-slate-300">
                    Client: <strong>{appt.customerName}</strong> ({appt.customerCompany})
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-200 font-mono">{appt.date} ({appt.time})</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>Booked by AI Employee <strong>{appt.aiEmployeeName}</strong></span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
                <a
                  href={appt.meetingLink || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-colors inline-block"
                >
                  Join Meeting
                </a>
                {onDeleteAppointment && (
                  <button
                    onClick={() => {
                      if (confirm(`Cancel and delete appointment with ${appt.customerName}?`)) {
                        onDeleteAppointment(appt.id);
                      }
                    }}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete Appointment from Firestore"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: BOOK APPOINTMENT */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Executive Appointment"
        subtitle="Reserve a calendar slot and automatically notify attendee via email/SMS"
        maxWidth="md"
      >
        <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Session Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Executive Architecture Briefing"
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Client Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. David Vance"
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                value={customerCompany}
                onChange={(e) => setCustomerCompany(e.target.value)}
                placeholder="e.g. Global Tech Partners"
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Date & Time
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Tomorrow, 3:00 PM"
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                AI Employee
              </label>
              <select
                value={aiEmployeeName}
                onChange={(e) => setAiEmployeeName(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Sarah" className="bg-[#0b0f19]">Sarah (Sales SDR)</option>
                <option value="Maya" className="bg-[#0b0f19]">Maya (Support Lead)</option>
                <option value="Rahim" className="bg-[#0b0f19]">Rahim (Billing)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit">
              Confirm & Save to Firestore
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
