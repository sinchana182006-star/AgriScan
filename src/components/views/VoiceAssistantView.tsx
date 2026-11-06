import React, { useEffect, useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { DISEASES_DATABASE, PESTS_DATABASE } from '../../data/diseaseDatabase';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export const VoiceAssistantView: React.FC = () => {
  const { language, t } = useLanguage();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text:
        language === 'kn'
          ? 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಆಫ್‌ಲೈನ್ ಕೃಷಿ ಧ್ವನಿ ಸಹಾಯಕ. ಬೆಳೆ ರೋಗಗಳು ಅಥವಾ ಕೀಟಗಳ ಬಗ್ಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ.'
          : language === 'hi'
          ? 'नमस्ते! मैं आपका ऑफ़लाइन कृषि आवाज सहायक हूँ। फसल की बीमारियों, कीटों या जैविक उपचार के बारे में पूछें।'
          : language === 'ml'
          ? 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഓഫ്‌ലൈൻ കാർഷിക ശബ്ദ സഹായിയാണ്. വിള രോഗങ്ങളെക്കുറിച്ചോ കീടങ്ങളെക്കുറിച്ചോ ചോദിക്കുക.'
          : 'Hello! I am your offline AgriScan voice assistant. Ask any question about crop diseases, insect pests, or organic treatments.',
      timestamp: Date.now(),
    },
  ]);

  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition if available
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Map app language to speech recognition tag
      const langMap: Record<string, string> = {
        en: 'en-US',
        kn: 'kn-IN',
        hi: 'hi-IN',
        ml: 'ml-IN',
      };
      recognition.lang = langMap[language] || 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        handleSendQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListen = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Local Offline Response Engine (Rule & Knowledge Matcher)
  const generateOfflineResponse = (query: string): string => {
    const q = query.toLowerCase();

    // Ladybug / beneficial
    if (q.includes('ladybug') || q.includes('beneficial') || q.includes('predator') || q.includes('ಮಿತ್ರ') || q.includes('मित्र')) {
      return 'Ladybugs are high-value beneficial farmer allies! An adult ladybug consumes 50 to 100 aphids every day. Never spray broad-spectrum chemical insecticides when ladybug adults or alligator-like larvae are present on your crops.';
    }

    // Early Blight
    if (q.includes('early blight') || q.includes('alternaria') || q.includes('ಅರ್ಲಿ ಬ್ಲೈಟ್') || q.includes('अगेती')) {
      return 'Early Blight (Alternaria solani) causes dark concentric target-board rings surrounded by yellow chlorotic halos on lower older leaves. Prune infected lower foliage immediately up to 40cm, avoid overhead sprinkler irrigation, and apply organic copper hydroxide.';
    }

    // Late Blight
    if (q.includes('late blight') || q.includes('phytophthora') || q.includes('ಲೇಟ್ ಬ್ಲೈಟ್') || q.includes('पछेती')) {
      return 'Late Blight (Phytophthora infestans) is extremely dangerous in cool, moist weather (15-20°C and >90% humidity). It causes dark water-soaked rot with white downy spore felt on leaf undersides. Rogue out blighted vines and apply Bordeaux mixture or preventive bio-fungicides.';
    }

    // Tomato Yellow Leaf Curl
    if (q.includes('leaf curl') || q.includes('tylcv') || q.includes('ಎಲೆ ಸುರುಟು') || q.includes('पत्ती मरोड़')) {
      return 'Tomato Yellow Leaf Curl Virus causes severe upward leaf cupping, yellow borders, and stunted bushy crowns. It is transmitted exclusively by whiteflies (Bemisia tabaci). Install yellow sticky cards and spray neem seed extract to control the whitefly vectors.';
    }

    // Powdery Mildew
    if (q.includes('powdery mildew') || q.includes('ಬಿಳಿ ಬೂದಿ') || q.includes('चूर्णिल')) {
      return 'Powdery Mildew produces a talcum-like white floury coating on foliage and flower panicles. Treat with organic potassium bicarbonate (3g per liter) or wettable sulfur, and prune dense canopy foliage for air circulation.';
    }

    // Grapes Downy Mildew
    if (q.includes('downy mildew') || q.includes('grapes') || q.includes('ದ್ರಾಕ್ಷಿ') || q.includes('अंगूर')) {
      return 'Grapevine Downy Mildew creates translucent yellow oil-spots on upper leaves with dense white down on the underside. Keep the lowest leaves at least 50cm above the soil line and apply preventive copper hydroxide before rain.';
    }

    // Citrus Canker
    if (q.includes('canker') || q.includes('citrus') || q.includes('ಲಿಂಬೆ') || q.includes('नींबू')) {
      return 'Citrus Canker creates raised volcano-like corky craters surrounded by bright oily yellow halos on leaves and fruit. Prune cankered twigs and manage Asian citrus leafminers, whose feeding cuts allow bacterial entry.';
    }

    // Default smart match
    return 'For optimal crop protection, always scout lower canopy leaves during morning dew. Provide drip irrigation at the root base to avoid spore splash, maintain clean crop rotations, and avoid chemical overuse.';
  };

  const handleSendQuery = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    const replyText = generateOfflineResponse(query);
    const botMsg: ChatMessage = {
      id: 'bot_' + Date.now(),
      sender: 'assistant',
      text: replyText,
      timestamp: Date.now() + 1,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputQuery('');

    // Speak response
    speakText(replyText);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 md:text-2xl">{t.navVoice}</h2>
          <p className="text-xs text-stone-500">
            Offline voice interaction and diagnostic guidance in English, Kannada, Hindi, and Malayalam.
          </p>
        </div>

        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
          >
            <VolumeX className="h-4 w-4" /> Stop Voice Audio
          </button>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="font-semibold text-stone-500 self-center">Try asking:</span>
        {[
          'What are the symptoms of Early Blight?',
          'Are ladybugs pests or beneficial?',
          'How to treat Downy Mildew in Grapes?',
          'How does Late Blight spread?',
        ].map((q, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputQuery(q);
              handleSendQuery(q);
            }}
            className="rounded-lg border border-stone-200 bg-white px-3 py-1 text-stone-700 hover:border-emerald-500 hover:text-emerald-800 shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex h-96 flex-col overflow-y-auto rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col max-w-[85%] rounded-2xl p-3.5 text-xs ${
                isUser
                  ? 'ml-auto bg-emerald-600 text-white rounded-br-xs'
                  : 'mr-auto bg-stone-100 text-stone-800 rounded-bl-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="font-bold text-[10px] opacity-80">
                  {isUser ? 'Farmer' : 'AgriScan Assistant'}
                </span>
                {!isUser && (
                  <button
                    onClick={() => speakText(m.text)}
                    className="text-stone-500 hover:text-emerald-700"
                    title="Speak message aloud"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
          );
        })}
      </div>

      {/* Input controls: Voice Mic + Text input */}
      <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-xs">
        {/* Mic Button */}
        <button
          onClick={toggleListen}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          }`}
          title={isListening ? 'Listening... click to stop' : 'Click to speak'}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
          placeholder={isListening ? 'Listening to speech...' : 'Type or speak your agricultural question...'}
          className="flex-1 text-xs text-stone-800 outline-none px-2"
        />

        {/* Send Button */}
        <button
          onClick={() => handleSendQuery()}
          disabled={!inputQuery.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-400 transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
