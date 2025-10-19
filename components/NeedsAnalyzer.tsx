// components/NeedsAnalyzer.tsx
'use client';

import React, { useState } from 'react';
import { Target, ChevronRight, Lightbulb, AlertCircle } from 'lucide-react';
import { NeedResponse, NeedAssessment, NeedScore, NeedGap, NeedInsight } from '@/lib/types';
import { NEED_ITEMS, NEED_SCALE, NEED_CATEGORIES } from '@/lib/constants';
import { calculateNeedScores, calculateNeedGaps, getTopGaps } from '@/lib/utils';

interface NeedsAnalyzerProps {
  userId: string;
  pairId: string;
}

type AssessmentStep = 'intro' | 'self' | 'partner' | 'results';

export default function NeedsAnalyzer({ userId, pairId }: NeedsAnalyzerProps) {
  const [step, setStep] = useState<AssessmentStep>('intro');
  const [selfResponses, setSelfResponses] = useState<NeedResponse[]>([]);
  const [partnerResponses, setPartnerResponses] = useState<NeedResponse[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [insights, setInsights] = useState<NeedInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const currentPerspective = step === 'self' ? 'self' : 'partner_perceived';
  const responses = step === 'self' ? selfResponses : partnerResponses;
  const setResponses = step === 'self' ? setSelfResponses : setPartnerResponses;

  const handleResponse = (value: number) => {
    const itemId = NEED_ITEMS[currentItemIndex].id;
    const newResponses = [
      ...responses.filter(r => r.item_id !== itemId),
      { item_id: itemId, value }
    ];
    setResponses(newResponses);

    // Auto-advance
    if (currentItemIndex < NEED_ITEMS.length - 1) {
      setTimeout(() => setCurrentItemIndex(currentItemIndex + 1), 300);
    } else {
      // Completed this perspective
      if (step === 'self') {
        setStep('partner');
        setCurrentItemIndex(0);
      } else {
        generateInsights(newResponses);
      }
    }
  };

  const generateInsights = async (partnerResp: NeedResponse[]) => {
    setStep('results');
    setLoadingInsights(true);

    try {
      const selfScores = calculateNeedScores(selfResponses);
      const partnerScores = calculateNeedScores(partnerResp);
      const gaps = calculateNeedGaps(selfScores, partnerScores);
      const topGaps = getTopGaps(gaps, 3);

      // Call AI for personalized insights
      const response = await fetch('/api/needs/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gaps: topGaps })
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights || []);
      }
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  if (step === 'intro') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Target className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Needs & Wants</h2>
              <p className="text-sm text-gray-600">Discover what matters most</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">
              This brief assessment helps you understand your relationship needs and how you perceive your partner's needs.
            </p>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 text-sm mb-2">What you'll explore:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Security</strong> - Feeling safe and stable</li>
                <li>• <strong>Autonomy</strong> - Independence and choice</li>
                <li>• <strong>Belonging</strong> - Connection and intimacy</li>
                <li>• <strong>Fairness</strong> - Equity and reciprocity</li>
                <li>• <strong>Play</strong> - Joy and spontaneity</li>
                <li>• <strong>Rest</strong> - Recovery and ease</li>
                <li>• <strong>Recognition</strong> - Appreciation and being seen</li>
              </ul>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm text-amber-800">
                    <strong>Two perspectives:</strong> First, you'll rate how well YOUR needs are met. 
                    Then, you'll rate how well you think YOUR PARTNER'S needs are met (your perception).
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Takes about 5 minutes. Your responses create personalized insights and conversation scripts.
            </p>

            <button
              onClick={() => setStep('self')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Start Assessment
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'self' || step === 'partner') {
    const item = NEED_ITEMS[currentItemIndex];
    const progress = ((currentItemIndex + 1) / NEED_ITEMS.length) * 100;
    const existingResponse = responses.find(r => r.item_id === item.id);

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {step === 'self' ? 'Your Needs' : 'Your Partner\'s Needs (Your Perception)'}
            </span>
            <span className="text-sm text-gray-500">
              {currentItemIndex + 1} of {NEED_ITEMS.length}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
            {NEED_CATEGORIES.find(c => c.value === item.category)?.label}
          </span>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {step === 'self' ? item.question : `Your partner: ${item.question.replace('I', 'They').replace('My', 'Their').replace('Our', 'Their')}`}
          </h3>
          <p className="text-sm text-gray-600">
            {step === 'self' 
              ? 'How well is this need met for YOU in your relationship?' 
              : 'How well do you think this need is met for YOUR PARTNER?'}
          </p>
        </div>

        {/* Response Scale */}
        <div className="space-y-2">
          {NEED_SCALE.map((option) => (
            <button
              key={option.value}
              onClick={() => handleResponse(option.value)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                existingResponse?.value === option.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{option.label}</span>
                <span className="text-2xl font-bold text-purple-600">{option.value}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {currentItemIndex > 0 && (
            <button
              onClick={() => setCurrentItemIndex(currentItemIndex - 1)}
              className="px-6 bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Back
            </button>
          )}
        </div>
      </div>
    );
  }

  // Results
  const selfScores = calculateNeedScores(selfResponses);
  const partnerScores = calculateNeedScores(partnerResponses);
  const gaps = calculateNeedGaps(selfScores, partnerScores);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Your Needs Analysis</h2>

      {/* Scores Comparison */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Need Scores</h3>
        <div className="space-y-3">
          {NEED_CATEGORIES.map((cat) => {
            const selfScore = selfScores.find(s => s.category === cat.value)?.score || 0;
            const partnerScore = partnerScores.find(s => s.category === cat.value)?.score || 0;
            const gap = gaps.find(g => g.category === cat.value)?.gap || 0;

            return (
              <div key={cat.value} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{cat.label}</span>
                  <span className={`text-sm font-semibold ${
                    Math.abs(gap) > 1 ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {Math.abs(gap) > 1 ? 'Gap' : 'Aligned'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 mb-1">You</div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${(selfScore / 5) * 100}%` }}
                      />
                    </div>
                    <div className="text-blue-600 font-semibold mt-1">{selfScore.toFixed(1)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Partner (perceived)</div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pink-500"
                        style={{ width: `${(partnerScore / 5) * 100}%` }}
                      />
                    </div>
                    <div className="text-pink-600 font-semibold mt-1">{partnerScore.toFixed(1)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Insights */}
      {loadingInsights ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Generating personalized insights...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Lightbulb className="text-yellow-500" size={20} />
            Personalized Insights
          </h3>
          {insights.map((insight, idx) => (
            <div key={idx} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  insight.type === 'self_unmet' ? 'bg-amber-100' :
                  insight.type === 'partner_unmet' ? 'bg-blue-100' :
                  'bg-green-100'
                }`}>
                  {insight.type === 'self_unmet' ? '🎯' : insight.type === 'partner_unmet' ? '💡' : '✓'}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1 capitalize">
                    {insight.category} {insight.gap > 0 ? '(Partner)' : insight.gap < 0 ? '(You)' : '(Aligned)'}
                  </h4>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Try saying:</p>
                    <p className="text-gray-800 italic bg-white p-3 rounded-lg border border-purple-200">
                      "{insight.script}"
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">Micro-experiment:</p>
                    <p className="text-sm text-gray-800">{insight.micro_experiment}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => {
          setStep('intro');
          setSelfResponses([]);
          setPartnerResponses([]);
          setCurrentItemIndex(0);
          setInsights([]);
        }}
        className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
      >
        Retake Assessment
      </button>
    </div>
  );
}
