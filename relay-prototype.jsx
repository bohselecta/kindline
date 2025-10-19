import React, { useState } from 'react';
import { Heart, Send, X, AlertTriangle, CheckCircle, MessageCircle, TrendingUp } from 'lucide-react';

const RelayApp = () => {
  const [messages, setMessages] = useState([]);
  const [rawText, setRawText] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [isAligning, setIsAligning] = useState(false);
  const [alignedPreview, setAlignedPreview] = useState(null);
  const [showComposer, setShowComposer] = useState(false);

  const moods = [
    { emoji: '🙂', label: 'Calm', value: 'calm' },
    { emoji: '😕', label: 'Worried', value: 'worried' },
    { emoji: '😡', label: 'Frustrated', value: 'frustrated' },
    { emoji: '😢', label: 'Hurt', value: 'hurt' },
    { emoji: '😴', label: 'Tired', value: 'tired' }
  ];

  const SYSTEM_PROMPT = `You are a relationship alignment translator. Rewrite the user's message to their partner so that it is clear, specific, non-blaming, brief (45–120 words), and focused on observation, feeling, need, and a concrete request. Use 'I' statements, factual language, and gentle tone. Preserve intent and key facts. Avoid therapy jargon. Include at most one curious, non-leading question if helpful. Prohibit contempt, character attacks, mind-reading, ultimatums, and score-keeping. If the user is attempting a repair, include one small appreciation or accountability statement.

Return your response as a JSON object with this exact structure:
{
  "aligned": "the rewritten message",
  "flags": {
    "criticism": true/false,
    "defensiveness": true/false,
    "contempt": true/false,
    "stonewalling": true/false,
    "anger_level": 1-5
  },
  "suggestion": "optional suggestion string or null",
  "repair_tag": "optional repair phrase or null"
}`;

  const alignMessage = async () => {
    if (!rawText.trim() || !selectedMood) return;

    setIsAligning(true);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [
            {
              role: "user",
              content: `${SYSTEM_PROMPT}\n\nRaw message: ${rawText}\nContext: mood=${selectedMood.value}, intensity=${intensity}\n\nIMPORTANT: Respond ONLY with valid JSON. No other text.`
            }
          ]
        })
      });

      const data = await response.json();
      let resultText = data.content[0].text;
      
      // Strip markdown code blocks if present
      resultText = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const result = JSON.parse(resultText);
      
      setAlignedPreview({
        raw: rawText,
        aligned: result.aligned,
        flags: result.flags,
        suggestion: result.suggestion,
        repair_tag: result.repair_tag,
        mood: selectedMood,
        intensity: intensity,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Alignment error:', error);
      alert('Failed to align message. Please try again.');
    } finally {
      setIsAligning(false);
    }
  };

  const confirmSend = () => {
    if (!alignedPreview) return;
    
    setMessages([...messages, {
      ...alignedPreview,
      id: Date.now(),
      sender: 'you'
    }]);
    
    // Reset composer
    setRawText('');
    setSelectedMood(null);
    setIntensity(3);
    setAlignedPreview(null);
    setShowComposer(false);
  };

  const cancelPreview = () => {
    setAlignedPreview(null);
  };

  const resetComposer = () => {
    setRawText('');
    setSelectedMood(null);
    setIntensity(3);
    setAlignedPreview(null);
    setShowComposer(false);
  };

  const flagColors = {
    criticism: 'text-amber-600',
    defensiveness: 'text-blue-600',
    contempt: 'text-red-600',
    stonewalling: 'text-gray-600'
  };

  const flagLabels = {
    criticism: 'Criticism detected',
    defensiveness: 'Defensive tone',
    contempt: 'Contempt/attack',
    stonewalling: 'Avoidance'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="text-rose-500" size={32} fill="currentColor" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-blue-600 bg-clip-text text-transparent">
              Relay
            </h1>
          </div>
          <p className="text-gray-600 text-sm">Say what you mean, kindly. Hear what they mean, clearly.</p>
        </div>

        {/* Message Thread */}
        <div className="bg-white rounded-2xl shadow-lg mb-4 p-6 min-h-[300px] max-h-[400px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageCircle size={48} className="mb-2 opacity-50" />
              <p className="text-sm">Your aligned messages will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-gradient-to-r from-blue-50 to-rose-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{msg.mood.emoji}</span>
                    <span className="text-xs text-gray-500">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.repair_tag && (
                      <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Repair attempt
                      </span>
                    )}
                  </div>
                  <p className="text-gray-800 leading-relaxed">{msg.aligned}</p>
                  {msg.repair_tag && (
                    <p className="text-sm text-green-700 mt-2 italic">"{msg.repair_tag}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Composer or Preview */}
        {!showComposer && !alignedPreview ? (
          <button
            onClick={() => setShowComposer(true)}
            className="w-full bg-gradient-to-r from-rose-500 to-blue-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            Start a Message
          </button>
        ) : alignedPreview ? (
          /* Preview Card */
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Aligned Preview</h3>
              <button onClick={cancelPreview} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Flags */}
            {Object.entries(alignedPreview.flags).some(([key, val]) => val && key !== 'anger_level') && (
              <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-amber-800 mb-1">Detected in original:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(alignedPreview.flags).map(([key, val]) => 
                        val && key !== 'anger_level' && (
                          <span key={key} className={`text-xs px-2 py-1 rounded-full bg-white ${flagColors[key]}`}>
                            {flagLabels[key]}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Before/After */}
            <div className="space-y-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1 font-medium">Original:</p>
                <p className="text-sm text-gray-700 italic">{alignedPreview.raw}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border-2 border-green-200">
                <p className="text-xs text-green-700 mb-2 font-medium flex items-center gap-1">
                  <CheckCircle size={14} />
                  Aligned message:
                </p>
                <p className="text-gray-800 leading-relaxed">{alignedPreview.aligned}</p>
              </div>
            </div>

            {/* Repair Tag */}
            {alignedPreview.repair_tag && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-700 mb-1 font-medium">Suggested repair phrase:</p>
                <p className="text-sm text-green-800 italic">"{alignedPreview.repair_tag}"</p>
              </div>
            )}

            {/* Suggestion */}
            {alignedPreview.suggestion && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 mb-1 font-medium flex items-center gap-1">
                  <TrendingUp size={14} />
                  Coach's tip:
                </p>
                <p className="text-sm text-blue-800">{alignedPreview.suggestion}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={confirmSend}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Confirm & Send
              </button>
              <button
                onClick={cancelPreview}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* Composer */
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Compose Message</h3>
              <button onClick={resetComposer} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Mood Selection */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">How are you feeling?</label>
              <div className="flex gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood)}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                      selectedMood?.value === mood.value
                        ? 'border-blue-500 bg-blue-50 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs text-gray-600">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity */}
            {selectedMood && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Intensity: {intensity}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            )}

            {/* Raw Text Input */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">What do you want to say?</label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Write what's on your mind, unfiltered..."
                className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Be honest and specific. The AI will help align your message.</p>
            </div>

            {/* Align Button */}
            <button
              onClick={alignMessage}
              disabled={!rawText.trim() || !selectedMood || isAligning}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAligning ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Aligning...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Align Message
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>This is a learning prototype. Not a substitute for therapy.</p>
          <p className="mt-1">Messages are processed locally and not stored externally.</p>
        </div>
      </div>
    </div>
  );
};

export default RelayApp;
