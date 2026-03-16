import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, Play, Square, Loader, Sparkles, Send, Eye } from 'lucide-react';

export default function AIPanel({ isOpen }) {
  const [isCapturing, _setIsCapturing] = useState(false);
  const isCapturingRef = useRef(false);
  const setIsCapturing = (val) => {
    isCapturingRef.current = val;
    _setIsCapturing(val);
  };

  const [status, _setStatus] = useState('Idle');
  const statusRef = useRef('Idle');
  const setStatus = (val) => {
    statusRef.current = val;
    _setStatus(val);
  };
  const [messages, setMessages] = useState([
    { role: 'agent', content: "Hello. I am FlowMind. I can see your screen and help you automate complex workflows. Click 'Start Real-Time Vision' to begin." }
  ]);
  const [inputValue, setInputValue] = useState("");
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const messagesEndRef = useRef(null);
  const handleSendPromptRef = useRef(null);

  // Keep ref up to date with latest closure
  useEffect(() => {
    handleSendPromptRef.current = handleSendPrompt;
  });

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleScreenCapture = async () => {
    if (isCapturingRef.current) {
      const tracks = streamRef.current?.getTracks();
      tracks?.forEach(track => track.stop());
      setIsCapturing(false);
      videoRef.current.srcObject = null;
      setStatus('Idle');
      return;
    }

    try {
      setStatus('Waiting for Permission...');
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        audio: false
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setIsCapturing(true);
      setStatus('Vision Active');
      
      // Stop automatically when user stops sharing via browser UI
      stream.getVideoTracks()[0].onended = () => {
        setIsCapturing(false);
        setStatus('Idle');
      };
    } catch (err) {
      console.error(err);
      setStatus('Permission Denied');
    }
  };

  // Voice Command Integration via Web Speech API
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        // Use Ref to call the latest handler and avoid stale closures
        setTimeout(() => handleSendPromptRef.current(null, transcript), 500);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleSendPrompt = async (e, voiceQuery = null) => {
    e?.preventDefault();
    const query = voiceQuery || inputValue;
    if (!query.trim()) return;

    setInputValue("");
    setMessages(prev => [...prev, { role: 'user', content: query }]);

    // USE REF HERE TO AVOID STALE CLOSURES
    if (!isCapturingRef.current) {
      setMessages(prev => [...prev, { role: 'agent', content: "Please enable Vision so I can see what you are talking about." }]);
      return;
    }

    setStatus('Analyzing Context...');

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    // Ensure video is ready
    if (!video || video.videoWidth === 0) {
      setMessages(prev => [...prev, { role: 'agent', content: "Video stream not ready. Please wait a moment." }]);
      setStatus('Vision Active');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob, 'screenshot.jpg');
      formData.append('prompt', query);
      formData.append('session_id', 'session_01');

      try {
        const res = await fetch('http://localhost:8000/api/analyze', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        
        if (data.success) {
          // ... (keep success logic)
          const content = (
            <div className="space-y-3">
               <div className="text-white leading-relaxed">
                 {data.thought}
               </div>
               <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-indigo-400 font-medium italic">
                 <Sparkles size={14} />
                 {data.suggested_feedback}
               </div>
            </div>
          );
          setMessages(prev => [...prev, { role: 'agent', content: content }]);
        } else {
          setMessages(prev => [...prev, { role: 'agent', content: `FlowMind Error: ${data.error || 'Unknown analysis failure'}` }]);
        }
      } catch (error) {
        console.error("Backend Error:", error);
        setMessages(prev => [...prev, { role: 'agent', content: "Could not reach the FlowMind backend. Ensure FastAPI is running on port 8000." }]);
      } finally {
        setStatus('Vision Active');
      }
    }, 'image/jpeg', 0.8);
  };

  return (
    <div 
      className={`fixed right-0 top-0 h-full w-[450px] glass-panel border-l border-white/10 z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'translate-x-0' : 'translate-x-[100%]'}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center p-0.5">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
              <Sparkles className="text-purple-400 w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 tracking-wide">
              FlowMind
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isCapturing ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vision Stream / Status UI */}
      <div className="p-6 border-b border-white/5 bg-black/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <Eye size={16} /> Modality: Vision
          </h3>
          <button 
            onClick={toggleScreenCapture}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${isCapturing ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
          >
            {isCapturing ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
            {isCapturing ? 'STOP VISION' : 'START VISION'}
          </button>
        </div>
        
        <div className="relative w-full aspect-video bg-black/50 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            className={`w-full h-full object-cover ${!isCapturing && 'hidden'}`}
          />
          {!isCapturing && (
            <div className="text-center">
              <Camera size={32} className="text-gray-600 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-gray-500">Vision stream inactive.<br/>Local screen capture only.</p>
            </div>
          )}
          {status === 'Analyzing Context...' && (
            <div className="absolute inset-0 bg-purple-500/5 flex items-center justify-center backdrop-blur-[2px]">
              <Loader size={24} className="animate-spin text-purple-400" />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center text-balance flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span> 
          Privacy First: Screenshots are analyzed locally in-memory and securely transmitted. No persistent storage.
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-white text-black rounded-br-sm' 
                  : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm backdrop-blur-md'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {status === 'Analyzing Context...' && (
          <div className="flex justify-start">
             <div className="max-w-[85%] rounded-2xl p-4 bg-white/5 border border-white/10 rounded-bl-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-75"></span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-black/40">
        <form onSubmit={handleSendPrompt} className="relative flex items-center group">
          <button 
            type="button" 
            onClick={toggleListening}
            className={`absolute left-3 p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
          >
            <Mic size={18} />
          </button>
          
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={status === 'Analyzing Context...'}
            placeholder="Ask FlowMind to analyze screen..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-12 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all shadow-inner disabled:opacity-50"
          />
          
          <button 
            type="submit" 
            disabled={!inputValue.trim() || status === 'Analyzing Context...'}
            className="absolute right-2 p-2 rounded-full bg-purple-600 text-white hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:bg-gray-700"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

    </div>
  );
}
