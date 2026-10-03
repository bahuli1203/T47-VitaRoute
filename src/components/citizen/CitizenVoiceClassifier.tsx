import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, AlertCircle, Volume2, ArrowRight } from 'lucide-react';
import { EmergencyCategory, BedTypeId, SpecialtyId } from '../../types/bedlink';
import { SupportedLanguage, TranslationDictionary } from '../../utils/translations';

// Web Speech API interface declarations for TypeScript
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface ClassifiedEmergency {
  category: EmergencyCategory;
  bedType: BedTypeId;
  specialties: SpecialtyId[];
  confidence: number;
  explanation: string;
  matchedKeywords: string[];
}

interface CitizenVoiceClassifierProps {
  language: SupportedLanguage;
  t: TranslationDictionary;
  onClassified: (result: ClassifiedEmergency, transcript: string) => void;
  onAutoConfirmSOS: (result: ClassifiedEmergency, transcript: string) => void;
}

export const CitizenVoiceClassifier: React.FC<CitizenVoiceClassifierProps> = ({
  language,
  t,
  onClassified,
  onAutoConfirmSOS,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [classification, setClassification] = useState<ClassifiedEmergency | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [autoSendCountdown, setAutoSendCountdown] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      // Select speech recognition locale based on active language
      if (language === 'hi') {
        recognition.lang = 'hi-IN';
      } else if (language === 'mr') {
        recognition.lang = 'mr-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript + ' ';
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (finalTrans) {
          setTranscript((prev) => {
            const updated = (prev + ' ' + finalTrans).trim();
            classifySpeech(updated);
            return updated;
          });
        }
        setInterimText(currentInterim);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Could not initialize speech recognition', e);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [language]);

  // Multilingual Clinical NLP Classifier
  const classifySpeech = (text: string) => {
    const lower = text.toLowerCase();

    // 1. Cardiac
    const cardiacTerms = [
      'heart', 'chest pain', 'cardiac', 'attack', 'stemi', 'angina', 'palpitation', 'pulse',
      'दिल', 'छाती में दर्द', 'हार्ट', 'हार्ट अटैक', 'धड़कन', 'दौरा',
      'छातीत दुखणे', 'हृदयविकार', 'हृदय', 'धडधड'
    ];
    // 2. Respiratory
    const respiratoryTerms = [
      'breath', 'breathing', 'oxygen', 'asthma', 'chok', 'gasp', 'suffocat', 'ventilator', 'lungs',
      'सांस', 'सांस फूलना', 'दम', 'ऑक्सीजन', 'फेफड़े', 'गला घुट',
      'श्वास', 'श्वास घेण्यास त्रास', 'दम लागणे', 'ऑक्सिजन', 'गुदमरणे'
    ];
    // 3. Trauma / Accident
    const traumaTerms = [
      'accident', 'blood', 'bleed', 'hit', 'crash', 'fracture', 'head injury', 'cut', 'fall', 'car', 'bike',
      'हादसा', 'एक्सीडेंट', 'खून', 'चोट', 'फ्रैक्चर', 'गिर गया', 'जख्म', 'सिर में चोट',
      'अपघात', 'रक्तस्त्राव', 'जखम', 'हाड मोडले', 'पडला'
    ];
    // 4. Burns
    const burnsTerms = [
      'burn', 'fire', 'acid', 'chemical', 'scald', 'electric shock',
      'जल गया', 'आग', 'केमिकल', 'झुलस', 'बिजली का झटका',
      'भाजले', 'आग लागली', 'ॲसिड', 'शॉक'
    ];
    // 5. Stroke
    const strokeTerms = [
      'stroke', 'paralysis', 'facial drop', 'slur', 'numb', 'cannot speak', 'faint', 'vision loss',
      'लकवा', 'स्ट्रोक', 'बेहोश', 'बोल नहीं पा रहा', 'मुंह टेढ़ा', 'सुन्न',
      'पक्षाघात', 'अर्धांगवायू', 'बोलता येत नाही', 'तोंड वाकडे'
    ];

    let matchedCat: EmergencyCategory = 'trauma';
    let bed: BedTypeId = 'trauma_resuscitation';
    let specs: SpecialtyId[] = ['trauma_level_1'];
    let matches: string[] = [];
    let confidence = 0.85;

    const findMatches = (list: string[]) => list.filter((term) => lower.includes(term.toLowerCase()));

    const cardiacMatches = findMatches(cardiacTerms);
    const respMatches = findMatches(respiratoryTerms);
    const traumaMatches = findMatches(traumaTerms);
    const burnsMatches = findMatches(burnsTerms);
    const strokeMatches = findMatches(strokeTerms);

    if (cardiacMatches.length > 0) {
      matchedCat = 'cardiac';
      bed = 'cardiac_monitored';
      specs = ['cardiac_cath_lab'];
      matches = cardiacMatches;
      confidence = 0.94;
    } else if (respMatches.length > 0) {
      matchedCat = 'respiratory';
      bed = 'icu_ventilator';
      specs = ['ecmo'];
      matches = respMatches;
      confidence = 0.92;
    } else if (burnsMatches.length > 0) {
      matchedCat = 'burn';
      bed = 'burns_isolation';
      specs = ['burn_unit'];
      matches = burnsMatches;
      confidence = 0.95;
    } else if (strokeMatches.length > 0) {
      matchedCat = 'stroke';
      bed = 'trauma_resuscitation';
      specs = ['stroke_thrombectomy'];
      matches = strokeMatches;
      confidence = 0.91;
    } else if (traumaMatches.length > 0) {
      matchedCat = 'trauma';
      bed = 'trauma_resuscitation';
      specs = ['trauma_level_1'];
      matches = traumaMatches;
      confidence = 0.89;
    }

    const result: ClassifiedEmergency = {
      category: matchedCat,
      bedType: bed,
      specialties: specs,
      confidence,
      explanation: `Matched clinical keywords: ${matches.slice(0, 3).join(', ')}`,
      matchedKeywords: matches,
    };

    setClassification(result);
    onClassified(result, text);

    // Trigger auto-send countdown if confidence is high
    if (confidence >= 0.88 && !autoSendCountdown) {
      setAutoSendCountdown(6);
    }
  };

  // Auto-send countdown ticker
  useEffect(() => {
    if (autoSendCountdown === null) return;

    if (autoSendCountdown <= 0) {
      if (classification) {
        onAutoConfirmSOS(classification, transcript);
      }
      setAutoSendCountdown(null);
      return;
    }

    timerRef.current = setTimeout(() => {
      setAutoSendCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoSendCountdown, classification, transcript, onAutoConfirmSOS]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
    } else {
      setTranscript('');
      setInterimText('');
      setClassification(null);
      setAutoSendCountdown(null);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.warn('Recognition start error', e);
        }
      }
    }
  };

  // Demo presets for fast 1-tap testing
  const demoVoiceSamples = [
    {
      lang: 'hi',
      title: 'छाती में तेज दर्द और सांस फूलना (Cardiac)',
      text: 'मेरे सीने में बहुत तेज दर्द हो रहा है और पसीना आ रहा है, सांस नहीं आ रही',
    },
    {
      lang: 'mr',
      title: 'रस्ता अपघात खूप रक्तस्त्राव (Trauma)',
      text: 'मोठा गाडीचा अपघात झाला आहे, खूप रक्तस्त्राव होतोय आणि बेशुद्ध आहे',
    },
    {
      lang: 'en',
      title: 'Severe Respiratory / Low SpO2 (Ventilator)',
      text: 'Patient is gasping for air, severe asthma crisis and oxygen saturation dropped under 80%',
    },
  ];

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">{t.voiceInputTitle}</h3>
            <p className="text-xs text-neutral-500">{t.voiceInputPrompt}</p>
          </div>
        </div>

        <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200 font-semibold self-start sm:self-auto">
          {language === 'hi' ? 'हिंदी (hi-IN)' : language === 'mr' ? 'मराठी (mr-IN)' : 'English (en-IN)'}
        </span>
      </div>

      {/* Voice Mic Trigger & Waveform */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={toggleListening}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                : 'bg-neutral-900 hover:bg-black text-white hover:scale-105'
            }`}
            title={isListening ? t.voiceStopListening : t.voiceSpeakNow}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <div>
            <span className="text-xs font-bold text-neutral-900 block">
              {isListening ? t.voiceListening : t.voiceSpeakNow}
            </span>
            <span className="text-[11px] text-neutral-500">
              {isListening
                ? 'Speaking in ' + (language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English')
                : speechSupported
                ? 'Tap mic to dictate in your native language'
                : 'Speech recognition unavailable; use quick demo audio below'}
            </span>
          </div>
        </div>

        {/* Audio Wave Visualizer Simulation */}
        {isListening && (
          <div className="flex items-center gap-1 h-6">
            <span className="w-1 h-3 bg-neutral-900 rounded-full animate-bounce"></span>
            <span className="w-1 h-6 bg-neutral-900 rounded-full animate-bounce [animation-delay:0.15s]"></span>
            <span className="w-1 h-4 bg-neutral-900 rounded-full animate-bounce [animation-delay:0.3s]"></span>
            <span className="w-1 h-7 bg-neutral-900 rounded-full animate-bounce [animation-delay:0.1s]"></span>
            <span className="w-1 h-3 bg-neutral-900 rounded-full animate-bounce [animation-delay:0.25s]"></span>
          </div>
        )}
      </div>

      {/* Spoken Text Display */}
      {(transcript || interimText) && (
        <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
            Transcribed Voice Input
          </span>
          <p className="text-neutral-900 font-medium">
            {transcript} <span className="text-neutral-400 italic">{interimText}</span>
          </p>
        </div>
      )}

      {/* Auto-Classified Result Card */}
      {classification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-900">
                {t.voiceClassifiedAs}{' '}
                <span className="uppercase tracking-wider underline">
                  {classification.category}
                </span>
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              {(classification.confidence * 100).toFixed(0)}% Match
            </span>
          </div>

          <p className="text-xs text-emerald-800 font-medium">
            {classification.explanation}
          </p>

          {/* Auto-Dispatch Countdown */}
          {autoSendCountdown !== null && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-emerald-200 text-xs">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-emerald-700" />
                {t.voiceAutoConfirmText} <strong className="font-mono text-sm underline">{autoSendCountdown}s</strong>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setAutoSendCountdown(null)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-700 text-xs font-bold hover:bg-neutral-50"
                >
                  {t.cancel} Auto-Send
                </button>
                <button
                  type="button"
                  onClick={() => onAutoConfirmSOS(classification, transcript)}
                  className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <span>Dispatch Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Voice Demo Presets */}
      <div className="pt-2 border-t border-neutral-100 space-y-1.5">
        <span className="text-[11px] font-semibold text-neutral-500 block">
          Or try a 1-tap voice test in Hindi, Marathi, or English:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {demoVoiceSamples.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setTranscript(sample.text);
                classifySpeech(sample.text);
              }}
              className="p-2.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-neutral-900 mb-1">
                <span>{sample.title}</span>
                <Volume2 className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900" />
              </div>
              <p className="text-[11px] text-neutral-500 line-clamp-1 italic">
                "{sample.text}"
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
