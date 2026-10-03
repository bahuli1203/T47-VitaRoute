import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  MessageSquare,
  Sparkles,
  Send,
  ExternalLink,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { SupportedLanguage, TranslationDictionary } from '../../utils/translations';
import { useBedLink } from '../../context/BedLinkContext';

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

interface OmnidimensionVoiceAgentProps {
  language: SupportedLanguage;
  t: TranslationDictionary;
}

interface Message {
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export const OmnidimensionVoiceAgent: React.FC<OmnidimensionVoiceAgentProps> = ({
  language,
  t,
}) => {
  const { hospitals, activeHolds, currentHospital } = useBedLink();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechOutputEnabled, setSpeechOutputEnabled] = useState(true);
  const [inputText, setInputText] = useState('');
  const [omnidimensionLink, setOmnidimensionLink] = useState(() => {
    return localStorage.getItem('vitaroute_omnidimension_url') || '';
  });
  const [showConfig, setShowConfig] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'agent',
      text:
        language === 'hi'
          ? 'नमस्ते! मैं वीटारूट का वॉइस एजेंट (Voice Agent) हूँ। आप मुझसे आईसीयू बेड, एम्बुलेंस डिस्पैच या अस्पताल होल्ड के बारे में पूछ सकते हैं।'
          : language === 'mr'
          ? 'नमस्कार! मी व्हिटारूटचा व्हॉइस एजंट (Voice Agent) आहे. आपण मला आयसीयू बेड, रुग्णवाहिका किंवा रुग्णालयाबद्दल विचारू शकता.'
          : 'Hello! I am VitaRoute’s Voice Agent. Ask me about real-time ICU beds, 120s ER holds, or nearest hospitals.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechDebounceTimerRef = useRef<any>(null);
  const pendingSpokenRef = useRef<string>('');

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save Omnidimension link to localStorage
  const handleSaveLink = (url: string) => {
    setOmnidimensionLink(url);
    localStorage.setItem('vitaroute_omnidimension_url', url);
  };

  // Setup Web Speech Recognition
  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      if (language === 'hi') recognition.lang = 'hi-IN';
      else if (language === 'mr') recognition.lang = 'mr-IN';
      else recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript + ' ';
        }
        const cleanSpoken = fullTranscript.trim();
        if (cleanSpoken) {
          setInputText(cleanSpoken);
          pendingSpokenRef.current = cleanSpoken;
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        const queryToRun = pendingSpokenRef.current.trim();
        if (queryToRun) {
          pendingSpokenRef.current = '';
          handleUserQuery(queryToRun);
        }
      };

      recognitionRef.current = recognition;
    } catch (_) {}

    return () => {
      if (speechDebounceTimerRef.current) clearTimeout(speechDebounceTimerRef.current);
    };
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      if (speechDebounceTimerRef.current) {
        clearTimeout(speechDebounceTimerRef.current);
      }
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsListening(false);

      // Submit accumulated question once user taps mic to finish
      if (pendingSpokenRef.current.trim()) {
        const queryToRun = pendingSpokenRef.current.trim();
        pendingSpokenRef.current = '';
        handleUserQuery(queryToRun);
      }
    } else {
      setInputText('');
      pendingSpokenRef.current = '';
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (_) {}
    }
  };

  // Speak response out loud using Web SpeechSynthesis
  const speakText = (text: string) => {
    if (!speechOutputEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-US';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Smart Context-Aware Knowledge Agent
  const handleUserQuery = (query: string) => {
    if (!query.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Answer calculation using live VitaRoute state
    const lower = query.toLowerCase();
    let reply = '';

    const totalIcuBeds = hospitals.reduce(
      (sum, h) => sum + (h.beds.icu_ventilator.available || 0),
      0
    );
    const topHospital = hospitals[0];

    if (
      lower.includes('icu') ||
      lower.includes('ventilator') ||
      lower.includes('बेड') ||
      lower.includes('bed')
    ) {
      if (language === 'hi') {
        reply = `वर्तमान में नेटवर्क में ${totalIcuBeds} आईसीयू वेंटिलेटर बेड उपलब्ध हैं। सबसे नजदीकी अस्पताल ${topHospital.name} है, जहाँ ${topHospital.beds.icu_ventilator.available} बेड रिक्त हैं।`;
      } else if (language === 'mr') {
        reply = `सध्या नेटवर्कमध्ये ${totalIcuBeds} आयसीयू व्हेंटिलेटर बेड्स उपलब्ध आहेत. सर्वात जवळचे रुग्णालय ${topHospital.name} आहे, जिथे ${topHospital.beds.icu_ventilator.available} बेड्स रिक्त आहेत.`;
      } else {
        reply = `There are currently ${totalIcuBeds} ICU Ventilator beds available across the network. The closest facility is ${topHospital.name} with ${topHospital.beds.icu_ventilator.available} beds open.`;
      }
    } else if (
      lower.includes('120') ||
      lower.includes('hold') ||
      lower.includes('होल्ड') ||
      lower.includes('आरक्षण')
    ) {
      if (language === 'hi') {
        reply = `120-सेकंड कन्फर्म-एंड-होल्ड प्रोटोकॉल के तहत अस्पताल ईआर को 2 मिनट में बेड स्वीकारना होता है। यदि समय समाप्त होता है या अस्वीकार किया जाता है, तो वीटारूट स्वतः अगले सर्वश्रेष्ठ अस्पताल को ऑफर करता है।`;
      } else if (language === 'mr') {
        reply = `120-सेकंद होल्ड प्रोटोकॉलनुसार रुग्णालयाला 2 मिनिटांत बेड आरक्षित करावा लागतो. मुदत संपल्यास प्रणाली आपोआप पुढील रुग्णालयाकडे विनंती वळवते.`;
      } else {
        reply = `The 120-second confirm-and-hold protocol reserves the resuscitation bay while the ER physician confirms. If rejected or timed out, VitaRoute automatically cascades to the next best hospital.`;
      }
    } else if (
      lower.includes('nurse') ||
      lower.includes('नर्स') ||
      lower.includes('update') ||
      lower.includes('अपडेट')
    ) {
      if (language === 'hi') {
        reply = `वार्ड नर्स अपने फोन पर 1-टैप (+1 या -1) बटन दबाकर सिर्फ 10 सेकंड में बेड की गणना अपडेट कर सकती हैं। इससे हर सूची में डेटा की सटीक ताजगी दिखाई देती है।`;
      } else if (language === 'mr') {
        reply = `वॉर्ड नर्स आपल्या मोबाईलवर फक्त एका टॅपमध्ये 10 सेकंदात बेड्स अद्ययावत करू शकतात.`;
      } else {
        reply = `Ward nurses update bed counts in under 10 seconds via large tactile (+1 / -1) buttons on standard mobile phones, showing exact data freshness minutes.`;
      }
    } else if (
      lower.includes('sos') ||
      lower.includes('citizen') ||
      lower.includes('नागरिक') ||
      lower.includes('मदद') ||
      lower.includes('help')
    ) {
      if (language === 'hi') {
        reply = `नागरिक 1-टैप में एसओएस दबा सकते हैं या बोलकर अपनी स्थिति बता सकते हैं। वीटारूट स्वतः बीमारी की पहचान कर तत्काल जीपीएस के साथ एम्बुलेंस रवाना करता है।`;
      } else if (language === 'mr') {
        reply = `नागरिक 1-टॅपमध्ये किंवा आवाजाद्वारे आणीबाणी नोंदवू शकतात. प्रणाली आपोआप आजाराचे वर्गीकरण करून रुग्णवाहिका पाठवते.`;
      } else {
        reply = `Citizens can trigger a 1-tap SOS or speak their symptoms. VitaRoute automatically classifies the emergency and dispatches the nearest ambulance with GPS telematics.`;
      }
    } else {
      if (language === 'hi') {
        reply = `वीटारूट में आपका स्वागत है। वर्तमान में ${hospitals.length} अस्पताल जुड़े हैं और ${activeHolds.length} सक्रिय बेड होल्ड चल रहे हैं। आप बेड स्थिति या आपातकालीन दिशानिर्देश पूछ सकते हैं।`;
      } else if (language === 'mr') {
        reply = `व्हिटारूटमध्ये आपले स्वागत आहे. सध्या ${hospitals.length} रुग्णालये जोडलेली आहेत आणि ${activeHolds.length} सक्रिय बेड्स होल्ड सुरू आहेत.`;
      } else {
        reply = `VitaRoute is actively monitoring ${hospitals.length} regional hospitals with ${activeHolds.length} active emergency holds. Ask about ICU beds, road ETA, or triage rules.`;
      }
    }

    setTimeout(() => {
      const agentMsg: Message = {
        sender: 'agent',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, agentMsg]);
      speakText(reply);
    }, 400);
  };

  const quickQuestions =
    language === 'hi'
      ? ['निकटतम आईसीयू बेड कहाँ है?', '120 सेकंड होल्ड कैसे काम करता है?', 'नर्स बेड कैसे अपडेट करती हैं?']
      : language === 'mr'
      ? ['जवळचे आयसीयू बेड कुठे आहे?', '120 सेकंद होल्ड कसे चालते?', 'नर्स बेड कसे अपडेट करतात?']
      : ['Where is the nearest ICU bed?', 'How does the 120s hold work?', 'How do nurses update beds?'];

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 sm:bottom-6 right-6 z-40 bg-neutral-900 hover:bg-black text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2.5 cursor-pointer border border-neutral-700 hover:scale-105"
        title="Open Voice Agent"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-bold font-sans">
          {language === 'hi' ? 'वॉइस एजेंट' : language === 'mr' ? 'व्हॉइस एजंट' : 'Voice Agent'}
        </span>
      </button>

      {/* Slide-Up / Centered Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white border border-neutral-200 rounded-t-2xl sm:rounded-2xl w-full max-w-lg shadow-2xl flex flex-col h-[85vh] sm:h-[620px] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                    <span>{t.voiceAgentTitle}</span>
                    <span className="text-[10px] bg-neutral-200 px-1.5 py-0.2 rounded font-mono text-neutral-700">
                      v2.4
                    </span>
                  </h3>
                  <p className="text-[11px] text-neutral-500">{t.voiceAgentSubtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowConfig(!showConfig)}
                  className={`p-2 rounded-lg text-neutral-600 hover:text-neutral-900 transition-colors ${
                    showConfig ? 'bg-neutral-200' : 'hover:bg-neutral-100'
                  }`}
                  title="Configure Voice Agent Link"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSpeechOutputEnabled(!speechOutputEnabled)}
                  className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                  title={speechOutputEnabled ? 'Mute Voice Responses' : 'Enable Voice Responses'}
                >
                  {speechOutputEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                  title="Close Agent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Voice Agent Link Configuration Drawer */}
            {showConfig && (
              <div className="p-3.5 bg-neutral-100 border-b border-neutral-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900 flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-700" />
                    Voice Agent Link (OmniDimension Embed):
                  </span>
                  <span className="text-[11px] text-neutral-500">Paste custom agent URL</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={omnidimensionLink}
                    onChange={(e) => handleSaveLink(e.target.value)}
                    placeholder="https://omnidimension.ai/agent/your-agent-id or embed link"
                    className="flex-1 bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  {omnidimensionLink && (
                    <button
                      type="button"
                      onClick={() => handleSaveLink('')}
                      className="px-2.5 py-1 rounded bg-neutral-200 text-neutral-700 font-bold hover:bg-neutral-300 text-[11px]"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-neutral-500">
                  {omnidimensionLink
                    ? '✓ Custom Voice Agent URL is active.'
                    : 'Using built-in multi-lingual VitaRoute voice agent (Hindi, Marathi, English). Paste your OmniDimension or custom link above anytime to load external embed.'}
                </p>
              </div>
            )}

            {/* If custom iframe URL is provided, display it directly */}
            {omnidimensionLink ? (
              <div className="flex-1 w-full bg-white relative">
                <iframe
                  src={omnidimensionLink}
                  title="Voice Agent"
                  className="w-full h-full border-0"
                  allow="microphone; camera; display-capture"
                />
              </div>
            ) : (
              /* Built-in Multi-lingual Voice Chat Interface */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Message Log */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/50">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          m.sender === 'user'
                            ? 'bg-neutral-900 text-white shadow-xs'
                            : 'bg-white text-neutral-900 border border-neutral-200 shadow-xs'
                        }`}
                      >
                        <p>{m.text}</p>
                      </div>
                      <span className="text-[10px] text-neutral-400 mt-1 px-1 font-mono">
                        {m.time}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Inquiries */}
                <div className="p-2.5 bg-white border-t border-neutral-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                  <span className="font-bold text-neutral-500 shrink-0 px-1">
                    {t.suggestedQuestions}
                  </span>
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleUserQuery(q)}
                      className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 shrink-0 font-medium transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Input Bar with Mic & Send */}
                <div className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      isListening
                        ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-300'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                    }`}
                    title={isListening ? 'Stop listening' : 'Speak inquiry'}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUserQuery(inputText);
                    }}
                    placeholder={t.voiceAgentPlaceholder}
                    className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />

                  <button
                    type="button"
                    onClick={() => handleUserQuery(inputText)}
                    className="w-10 h-10 rounded-xl bg-neutral-900 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title={t.sendQuestion}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
