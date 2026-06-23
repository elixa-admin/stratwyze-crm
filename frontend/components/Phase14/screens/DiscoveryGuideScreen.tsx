'use client';

import { useState } from 'react';

interface DiscoveryGuideScreenProps {
  data: any;
  onStart: () => void;
  onBack: () => void;
}

export default function DiscoveryGuideScreen({ data, onStart, onBack }: DiscoveryGuideScreenProps) {
  const [checkedQuestions, setCheckedQuestions] = useState<string[]>([]);

  // Discovery questions templated by incumbent/context
  const getDiscoveryQuestions = () => {
    const questions = [
      {
        id: 'q1',
        section: 'Current State',
        question: 'Tell me about your current ITSM platform—how long have you been on it?',
        why: 'Understand their investment and potential switching costs',
        listen: 'Implementation timeline, satisfaction level, pain points',
      },
      {
        id: 'q2',
        section: 'Current State',
        question: "What's working well with your platform today? What would you change if you could?",
        why: 'Uncover pain points they prioritize',
        listen: 'Cost complaints, speed issues, adoption challenges, feature gaps',
      },
      {
        id: 'q3',
        section: 'Pain Points',
        question: 'How much are you spending annually on your ITSM platform—software, implementation, maintenance, training?',
        why: 'Quantify the problem (cost sensitivity)',
        listen: 'Budget range, cost structure, hidden/unexpected costs they mention',
      },
      {
        id: 'q4',
        section: 'Pain Points',
        question: 'How quickly can your team deploy new workflows or changes in your current platform?',
        why: 'Understand speed/agility pain (key HaloITSM advantage)',
        listen: 'Timeframes (weeks/months), complexity, who needs to be involved',
      },
      {
        id: 'q5',
        section: 'Adoption & Usage',
        question: 'How satisfied is your IT ops team with the platform—do they use all the capabilities you pay for?',
        why: 'Adoption is a major differentiator (HaloITSM = 90% adoption)',
        listen: 'Frustration with interface, underutilized features, resistance to change',
      },
      {
        id: 'q6',
        section: 'Decision Process',
        question: 'If you were starting fresh today with a new ITSM platform, would you choose your current platform again? Why or why not?',
        why: 'Get to honest assessment (not just "it works")',
        listen: 'Regrets, missing features, cost concerns, switching desire',
      },
      {
        id: 'q7',
        section: 'Decision Process',
        question: 'What does your roadmap look like for the next 2-3 years? Are you planning a platform refresh, expansion, or optimization?',
        why: 'Understand timing and budget availability',
        listen: 'Timeline, trigger events, budget availability, decision makers',
      },
    ];

    // Filter questions if incumbent platform known (add specific questions)
    if (data.incumbentPlatform === 'servicenow') {
      questions.push({
        id: 'q8',
        section: 'ServiceNow-Specific',
        question: 'How many custom workflows or integrations have you built in ServiceNow? How much maintenance do they require?',
        why: 'ServiceNow customization is a pain point and switching barrier',
        listen: 'Volume of custom code, maintenance burden, upgrade risks',
      });
    }

    return questions;
  };

  const questions = getDiscoveryQuestions();
  const sections = [...new Set(questions.map(q => q.section))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Discovery Guide</h2>
            <p className="text-sm text-slate-600 mt-1">{questions.length} tailored questions for your call</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Progress</p>
            <p className="text-lg font-bold text-blue-600">
              {checkedQuestions.length} / {questions.length}
            </p>
          </div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(checkedQuestions.length / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions by Section */}
      <div className="space-y-4">
        {sections.map(section => {
          const sectionQuestions = questions.filter(q => q.section === section);
          return (
            <div key={section} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-3 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">{section}</h3>
              </div>

              {/* Questions */}
              <div className="divide-y divide-slate-100">
                {sectionQuestions.map(q => (
                  <div key={q.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <label className="flex gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checkedQuestions.includes(q.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setCheckedQuestions([...checkedQuestions, q.id]);
                          } else {
                            setCheckedQuestions(checkedQuestions.filter(id => id !== q.id));
                          }
                        }}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 mt-0.5 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{q.question}</p>
                        <div className="flex flex-col sm:flex-row gap-2 mt-2 text-xs">
                          <div className="flex gap-1">
                            <span className="text-slate-400">📌 Why:</span>
                            <span className="text-slate-600">{q.why}</span>
                          </div>
                          <div className="flex gap-1">
                            <span className="text-slate-400">👂 Listen for:</span>
                            <span className="text-slate-600">{q.listen}</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      {data.incumbentPlatform && data.incumbentPlatform !== 'unknown' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-yellow-900 mb-2">💡 TIP: Incumbent Platform Detected</p>
          <p className="text-sm text-yellow-800">
            When they mention <strong>{data.incumbentPlatform}</strong>, ask about their specific pain points with it.
            We have a battle-card ready for the proposal stage.
          </p>
        </div>
      )}

      {/* Ready to Start */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🎯</div>
          <div>
            <h3 className="text-sm font-semibold text-emerald-900 mb-1">Ready to Start Your Call</h3>
            <p className="text-sm text-emerald-700 mb-2">
              Have this guide open during your discovery call. Check off questions as you cover them. After the call,
              you'll debrief with your notes.
            </p>
            <p className="text-xs text-emerald-600">
              ⏱️ Typical call: 45-60 minutes. You don't need to hit all questions—follow the conversation naturally.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onStart}
          className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          Start Call (Post-Debrief Later) →
        </button>
      </div>
    </div>
  );
}
