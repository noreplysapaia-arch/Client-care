import React, { useState } from 'react';
import {
  Database,
  Upload,
  Globe,
  HelpCircle,
  FileText,
  Plus,
  RefreshCw,
  CheckCircle2,
  Trash2,
  Sparkles,
  Link2,
} from 'lucide-react';
import { KnowledgeDocument } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

interface KnowledgePageProps {
  documents: KnowledgeDocument[];
  onAddDocument: (doc: KnowledgeDocument) => void;
}

export const KnowledgePage: React.FC<KnowledgePageProps> = ({
  documents,
  onAddDocument,
}) => {
  const [docsList, setDocsList] = useState<KnowledgeDocument[]>(documents);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'file' | 'url' | 'faq'>('all');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // New item form
  const [newTitle, setNewTitle] = useState<string>('');
  const [newType, setNewType] = useState<'file' | 'url' | 'faq'>('file');
  const [newSource, setNewSource] = useState<string>('');

  const handleResyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('Vector database successfully re-indexed and embedded into all active AI Employees.');
    }, 1200);
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const chunksNumber = Math.floor(25 + Math.random() * 80);
    const newDoc: KnowledgeDocument = {
      id: `doc_${Date.now()}`,
      title: newTitle,
      type: newType,
      source: newSource || (newType === 'url' ? 'https://pramanikgroup.com' : 'Direct manual upload'),
      status: 'synced',
      lastUpdated: 'Just now',
      updatedAt: 'Just now',
      chunks: chunksNumber,
      chunksCount: chunksNumber,
      size: newType === 'file' ? '1.8 MB' : 'Web Scrape',
      category: 'General',
    };

    onAddDocument(newDoc);
    setDocsList((prev) => [newDoc, ...prev]);
    setIsUploadModalOpen(false);
    setNewTitle('');
    setNewSource('');
  };

  const handleDelete = (id: string) => {
    setDocsList((prev) => prev.filter((d) => d.id !== id));
  };

  const filteredDocs = docsList.filter((d) => {
    if (activeTab === 'all') return true;
    return d.type === activeTab;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Company Knowledge Base
            </h1>
            <Badge variant="indigo" size="md">
              {docsList.length} Grounding Sources
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ground your AI employees in verified company facts, rate cards, SLAs, and technical documentation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={handleResyncAll}
            disabled={isSyncing}
            icon={RefreshCw}
          >
            {isSyncing ? 'Re-indexing...' : 'Re-sync Knowledge'}
          </Button>

          <Button
            variant="gradient"
            size="md"
            onClick={() => setIsUploadModalOpen(true)}
            icon={Plus}
          >
            Add Knowledge Source
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { key: 'all', label: 'All Sources' },
          { key: 'file', label: 'Files & PDFs' },
          { key: 'url', label: 'Website Crawls' },
          { key: 'faq', label: 'FAQs & Q&A' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              activeTab === t.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div className="card-surface rounded-2xl border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#05070E] border-b border-white/[0.06] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Document / Source Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Vector Chunks</th>
                <th className="py-3.5 px-4">Size</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        {doc.type === 'file' ? (
                          <FileText className="w-4 h-4" />
                        ) : doc.type === 'url' ? (
                          <Globe className="w-4 h-4" />
                        ) : (
                          <HelpCircle className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{doc.title}</span>
                        <span className="text-[11px] text-slate-400">{doc.source}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="capitalize text-slate-300 font-medium">{doc.type}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={doc.status === 'synced' ? 'emerald' : 'amber'} size="sm">
                      {doc.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-cyan-400 font-semibold">{doc.chunks ?? doc.chunksCount ?? 0} chunks</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {doc.size || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {doc.updatedAt ?? doc.lastUpdated ?? 'Recently'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Source"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD KNOWLEDGE MODAL */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Add Knowledge Source"
        subtitle="Upload training material or attach live URLs to ground your AI employees"
        maxWidth="md"
      >
        <form onSubmit={handleCreateDocument} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Source Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'file', label: 'PDF / File', icon: FileText },
                { type: 'url', label: 'Website URL', icon: Globe },
                { type: 'faq', label: 'Custom FAQ', icon: HelpCircle },
              ].map((fmt) => {
                const Icon = fmt.icon;
                return (
                  <button
                    type="button"
                    key={fmt.type}
                    onClick={() => setNewType(fmt.type as any)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      newType === fmt.type
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] font-medium">{fmt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Document Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. 2026 Enterprise Service Level Agreement"
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {newType === 'url' ? 'URL to Crawl' : 'File Name or Source Description'}
            </label>
            <input
              type="text"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              placeholder={newType === 'url' ? 'https://yourcompany.com/pricing' : 'internal_sla_v3.pdf'}
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit">
              Ingest & Embed Chunks
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
