// components/PairCodeDisplay.tsx
'use client';

import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

interface PairCodeDisplayProps {
  pairCode: string;
  onContinue: () => void;
}

export default function PairCodeDisplay({ pairCode, onContinue }: PairCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pairCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    const shareText = `Join me on Relay! Use pair code: ${pairCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Relay pair',
          text: shareText
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback to copy
      await handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Pair Code</h2>
          <p className="text-gray-600">Share this code with your partner</p>
        </div>

        {/* Pair Code Display */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-rose-200">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2 tracking-wider font-mono">
              {pairCode}
            </div>
            <p className="text-sm text-gray-600">Keep this code handy</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleCopy}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="text-green-600" size={20} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={20} />
                Copy Code
              </>
            )}
          </button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleShare}
              className="w-full bg-blue-100 hover:bg-blue-200 text-blue-900 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Share2 size={20} />
              Share Code
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2 text-sm">How to connect:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Share this code with your partner</li>
            <li>They open Relay and tap "Join a Pair"</li>
            <li>They enter this code</li>
            <li>You'll both be connected!</li>
          </ol>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Continue to App
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          You can find this code again in Settings
        </p>
      </div>
    </div>
  );
}
