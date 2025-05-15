import React, { useState, useMemo } from 'react';
import { ipcSections } from '../data/ipcData';

const IPCLibrary: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredSections = useMemo(() => {
    if (!search) return ipcSections;
    const searchTerms = search.toLowerCase().split(' ');
    return ipcSections.filter(sec => {
      const searchableText = `
        ${sec.section} ${sec.title} ${sec.description}
        ${(sec.keywords || []).join(' ')}
        ${(sec.relatedCases || []).map(c => `${c.name} ${c.summary} ${c.analysis || ''}`).join(' ')}
      `.toLowerCase();
      return searchTerms.every(term => searchableText.includes(term));
    });
  }, [search]);

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="bg-white border-b p-6">
        <h1 className="text-2xl font-semibold text-gray-800">IPC Library</h1>
        <p className="text-gray-600 mt-2">Search for IPC sections, view their descriptions, and see related cases.</p>
      </header>
      <div className="p-6">
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by section number, title, or keyword..."
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {filteredSections.length === 0 ? (
          <div className="text-center text-gray-500">No IPC sections found.</div>
        ) : (
          <div className="space-y-6">
            {filteredSections.map(sec => (
              <div key={sec.section} className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-2">Section {sec.section}: {sec.title}</h2>
                <p className="text-gray-700 mb-4">{sec.description}</p>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Related Cases:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {sec.relatedCases.map((c, idx) => (
                      <li key={idx}>
                        <span className="font-medium text-blue-600">{c.name}</span>
                        <span className="text-xs text-gray-500">({c.citation})</span>
                        <div className="text-gray-600 text-sm">{c.summary}</div>
                        <div className="text-gray-700 text-sm mt-1">{c.analysis}</div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-600">Keywords:</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sec.keywords.map((keyword, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IPCLibrary;