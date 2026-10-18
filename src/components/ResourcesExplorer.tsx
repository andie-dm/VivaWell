/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWellness } from '../context/WellnessContext';
import { WELLNESS_DOMAINS } from '../data/defaultWellnessData';
import { WellnessDomainId, WellnessResourceType, WellnessResource } from '../types/wellness';
import {
  BookOpen,
  Headphones,
  FileText,
  Bookmark,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  X,
  Compass,
  Clock,
  User,
  Heart,
  Activity,
  Users,
  Leaf,
  Briefcase,
  PiggyBank,
  Check,
  Video,
} from 'lucide-react';

const domainIconMap: Record<WellnessDomainId, React.FC<{ className?: string }>> = {
  physical: Activity,
  emotional: Heart,
  intellectual: BookOpen,
  social: Users,
  spiritual: Compass,
  environmental: Leaf,
  occupational: Briefcase,
  financial: PiggyBank,
};

const resourceTypeIconMap: Record<string, React.FC<{ className?: string }>> = {
  article: FileText,
  guide: BookOpen,
  podcast: Headphones,
  book: BookOpen,
  exercise: Compass,
  community: Users,
  video: Video,
};

export const ResourcesExplorer: React.FC = () => {
  const {
    resources,
    addResource,
    toggleBookmarkResource,
    deleteResource,
    t,
    language,
  } = useWellness();

  const resT = t.resources;

  const [selectedDomain, setSelectedDomain] = useState<WellnessDomainId | 'all'>('all');
  const [selectedType, setSelectedType] = useState<WellnessResourceType | 'all'>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Resource Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDomain, setFormDomain] = useState<WellnessDomainId>('physical');
  const [formType, setFormType] = useState<WellnessResourceType>('article');
  const [formAuthor, setFormAuthor] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formDuration, setFormDuration] = useState(8);
  const [formDesc, setFormDesc] = useState('');

  const filteredResources = resources.filter((res) => {
    const matchesDomain = selectedDomain === 'all' || res.domain === selectedDomain;
    const matchesType = selectedType === 'all' || res.type === selectedType;
    const matchesBookmark = !onlyBookmarked || res.isBookmarked;

    const title = language === 'es' ? res.titleEs : res.titleEn;
    const desc = language === 'es' ? res.descriptionEs : res.descriptionEn;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      title.toLowerCase().includes(searchLower) ||
      desc.toLowerCase().includes(searchLower) ||
      res.authorOrSource.toLowerCase().includes(searchLower);

    return matchesDomain && matchesType && matchesBookmark && matchesSearch;
  });

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    addResource({
      domain: formDomain,
      titleEn: formTitle.trim(),
      titleEs: formTitle.trim(),
      descriptionEn: formDesc.trim() || 'Curated supportive wellness resource.',
      descriptionEs: formDesc.trim() || 'Recurso de bienestar compasivo y enriquecedor.',
      type: formType,
      authorOrSource: formAuthor.trim() || (language === 'es' ? 'Comunidad VivaWell' : 'VivaWell Community'),
      url: formUrl.trim() || 'https://example.com/wellness-resource',
      durationMinutes: formDuration,
      isBookmarked: false,
    });

    setFormTitle('');
    setFormAuthor('');
    setFormUrl('');
    setFormDesc('');
    setIsAddModalOpen(false);
  };

  return (
    <section className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            {resT.title}
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            {resT.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 text-white hover:from-sky-600 hover:to-blue-800 transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{resT.addResourceButton}</span>
        </button>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedDomain('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            selectedDomain === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          {resT.allDomains}
        </button>
        {WELLNESS_DOMAINS.map((domain) => {
          const Icon = domainIconMap[domain.id];
          const isSelected = selectedDomain === domain.id;
          const label = language === 'es' ? domain.nameEs : domain.nameEn;
          return (
            <button
              key={domain.id}
              onClick={() => setSelectedDomain(domain.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 min-h-[44px] ${
                isSelected
                  ? 'shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
              style={{
                backgroundColor: isSelected ? domain.surfaceColor : undefined,
                color: isSelected ? domain.textColor : undefined,
                borderColor: isSelected ? domain.accentColor : undefined,
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Secondary Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={resT.searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Filters: Format Type and Bookmarks */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="py-2 px-3 text-xs rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none"
          >
            <option value="all">{resT.allTypes}</option>
            <option value="article">{resT.types.article}</option>
            <option value="guide">{resT.types.guide}</option>
            <option value="podcast">{resT.types.podcast}</option>
            <option value="exercise">{resT.types.exercise}</option>
            <option value="book">{resT.types.book}</option>
          </select>

          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`px-3 py-2 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 ${
              onlyBookmarked
                ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{resT.bookmarkedOnly}</span>
          </button>
        </div>
      </div>

      {/* Resources Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
          <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-stone-800">{resT.emptyTitle}</h4>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">{resT.emptySubtitle}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((res) => {
            const domainConfig = WELLNESS_DOMAINS.find((d) => d.id === res.domain);
            const DomainIcon = domainConfig ? domainIconMap[domainConfig.id] : Compass;
            const domainLabel = domainConfig
              ? language === 'es'
                ? domainConfig.nameEs
                : domainConfig.nameEn
              : res.domain;
            const TypeIcon = resourceTypeIconMap[res.type] || FileText;
            const title = language === 'es' ? res.titleEs : res.titleEn;
            const desc = language === 'es' ? res.descriptionEs : res.descriptionEn;
            const typeLabel = (resT.types as any)[res.type] || res.type;

            return (
              <div
                key={res.id}
                className="p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-stone-300 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Clean unboxed metadata discipline */}
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2.5">
                    <div
                      className="flex items-center gap-1.5 font-semibold text-xs px-2.5 py-1 rounded-lg"
                      style={{
                        backgroundColor: domainConfig?.surfaceColor,
                        color: domainConfig?.textColor,
                        border: domainConfig ? `1px solid ${domainConfig.accentColor}50` : undefined,
                      }}
                    >
                      <DomainIcon className="w-3.5 h-3.5" style={{ color: domainConfig?.textColor }} />
                      <span>{domainLabel}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {res.isCustom && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                          {resT.customBadge}
                        </span>
                      )}
                      <button
                        onClick={() => toggleBookmarkResource(res.id)}
                        className="text-stone-400 hover:text-amber-500 p-0.5"
                        title="Bookmark resource"
                        aria-label="Bookmark resource"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${res.isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 leading-snug">
                    {title}
                  </h3>

                  {/* Clean metadata strip */}
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1 mb-2.5">
                    <span className="flex items-center gap-1">
                      <TypeIcon className="w-3 h-3 text-stone-400" />
                      {typeLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    {res.durationMinutes && (
                      <>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {res.durationMinutes} min
                        </span>
                        <span aria-hidden="true">·</span>
                      </>
                    )}
                    <span className="truncate max-w-[140px]">{res.authorOrSource}</span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {desc}
                  </p>
                </div>

                {/* Card Action Footer */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <a
                    href={res.url || '#'}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                  >
                    <span>{resT.openLink}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {res.isCustom && (
                    <button
                      onClick={() => deleteResource(res.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded"
                      title="Delete custom resource"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-xl border border-stone-200 overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  {resT.modal.title}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {resT.modal.subtitle}
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="p-5 overflow-y-auto space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {resT.modal.titleLabel}
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={resT.modal.titlePlaceholder}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-stone-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {resT.modal.domainLabel}
                  </label>
                  <select
                    value={formDomain}
                    onChange={(e) => setFormDomain(e.target.value as WellnessDomainId)}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-stone-200 bg-white"
                  >
                    {WELLNESS_DOMAINS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {language === 'es' ? d.nameEs : d.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {resT.modal.typeLabel}
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as WellnessResourceType)}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-stone-200 bg-white"
                  >
                    <option value="article">{resT.types.article}</option>
                    <option value="guide">{resT.types.guide}</option>
                    <option value="podcast">{resT.types.podcast}</option>
                    <option value="exercise">{resT.types.exercise}</option>
                    <option value="book">{resT.types.book}</option>
                    <option value="community">{resT.types.community}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {resT.modal.authorLabel}
                  </label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder={resT.modal.authorPlaceholder}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-stone-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {resT.modal.durationLabel}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-stone-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {resT.modal.urlLabel}
                </label>
                <input
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder={resT.modal.urlPlaceholder}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-stone-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {resT.modal.descLabel}
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder={resT.modal.descPlaceholder}
                  className="w-full py-2.5 px-3 text-xs rounded-xl border border-stone-200 bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                >
                  {resT.modal.cancelButton}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-600 hover:to-blue-800 rounded-xl shadow-xs transition-colors"
                >
                  {resT.modal.saveButton}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
