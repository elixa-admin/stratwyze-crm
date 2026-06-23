'use client';

import { useState, useRef, useEffect } from 'react';

interface BriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefing: {
    executiveSummary: string;
    currentRole: string;
    responsibilities: string[];
    likelyPriorities: string[];
    potentialPainPoints: string[];
    conversationStarters: string[];
    outreachAngle: string;
    discoveryQuestions: string[];
  };
}

/**
 * Full briefing modal - slides up from bottom
 * Swipe down to dismiss (iOS-native UX)
 * Scrollable content
 */
export default function BriefingModal({ isOpen, onClose, briefing }: BriefingModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);

  // Handle swipe-to-dismiss
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== contentRef.current && !contentRef.current?.contains(e.target as Node)) {
      return;
    }
    setIsDragging(true);
    startYRef.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientY - startYRef.current;
    if (delta > 0) {
      setDragOffset(delta);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (dragOffset > 100) {
      onClose();
    }
    setDragOffset(0);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity z-40 ${
          isOpen ? 'opacity-30' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={contentRef}
        onMouseDown={handleMouseDown}
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto transition-transform ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          transform: `translateY(${dragOffset}px)`,
        }}
      >
        {/* Handle Bar */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 rounded-t-2xl flex justify-center">
          <div className="w-12 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="sticky top-12 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between z-40">
          <h2 className="text-lg font-bold text-slate-900">Full Briefing</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 pb-8">
          {/* Executive Summary */}
          <section>
            <h3 className="text-sm font-bold text-slate-600 mb-2">Executive Summary</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {briefing.executiveSummary}
            </p>
          </section>

          {/* Current Role */}
          <section>
            <h3 className="text-sm font-bold text-slate-600 mb-2">Current Role</h3>
            <p className="text-sm text-slate-700">{briefing.currentRole}</p>
          </section>

          {/* Responsibilities */}
          {briefing.responsibilities.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-slate-600 mb-2">Responsibilities</h3>
              <ul className="space-y-1">
                {briefing.responsibilities.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-blue-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Likely Priorities */}
          {briefing.likelyPriorities.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-slate-600 mb-2">Likely Priorities</h3>
              <ul className="space-y-1">
                {briefing.likelyPriorities.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-amber-500">🎯</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Potential Pain Points */}
          {briefing.potentialPainPoints.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-slate-600 mb-2">Potential Pain Points</h3>
              <ul className="space-y-1">
                {briefing.potentialPainPoints.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-red-500">⚠️</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Conversation Starters */}
          {briefing.conversationStarters.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-slate-600 mb-2">Conversation Starters</h3>
              <ul className="space-y-2">
                {briefing.conversationStarters.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-slate-700 bg-green-50 border border-green-200 rounded p-2 italic"
                  >
                    "{item}"
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Outreach Angle */}
          {briefing.outreachAngle && (
            <section>
              <h3 className="text-sm font-bold text-slate-600 mb-2">Outreach Angle</h3>
              <p className="text-sm text-slate-700 bg-blue-50 border border-blue-200 rounded p-3 leading-relaxed">
                {briefing.outreachAngle}
              </p>
            </section>
          )}

          {/* Discovery Questions */}
          {briefing.discoveryQuestions.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-slate-600 mb-2">Discovery Questions</h3>
              <ol className="space-y-2">
                {briefing.discoveryQuestions.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-slate-500 font-semibold min-w-fit">{idx + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
