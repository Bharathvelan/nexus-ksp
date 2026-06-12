"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface VoiceCaptureProps {
  onTranscription: (text: string, lang: string) => void;
}

export default function VoiceCapture({ onTranscription }: VoiceCaptureProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);

    ctx.fillStyle = 'transparent';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / dataArrayRef.current.length) * 2.5;
    let x = 0;

    for (let i = 0; i < dataArrayRef.current.length; i++) {
      const barHeight = (dataArrayRef.current[i] / 255) * canvas.height;
      ctx.fillStyle = `rgb(${dataArrayRef.current[i] + 100}, 168, 76)`; // gold tint
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }

    animationFrameRef.current = requestAnimationFrame(drawWaveform);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 64;
      source.connect(analyser);
      
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      drawWaveform();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Mocking the backend call to /api/voice-to-text
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        try {
          // In real implementation:
          // const response = await fetch("http://localhost:8001/api/v1/voice/transcribe", { method: 'POST', body: formData });
          // const data = await response.json();
          // onTranscription(data.text, data.detected_language);
          
          // Mock response
          setTimeout(() => {
            onTranscription("ಬೆಂಗಳೂರಿನಲ್ಲಿ ಕಳೆದ ತಿಂಗಳು ನಡೆದ ಅಪರಾಧಗಳನ್ನು ತೋರಿಸಿ (Show crimes that happened in Bangalore last month)", "kn");
            setIsProcessing(false);
          }, 1500);

        } catch (error) {
          console.error("Transcription failed", error);
          setIsProcessing(false);
        }

        // Cleanup tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Microphone access is required for voice capture.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {isRecording && (
        <canvas ref={canvasRef} width="100" height="30" className="opacity-80" />
      )}
      
      {isProcessing ? (
        <button disabled className="p-3 bg-gray-200 text-gray-500 rounded-full cursor-not-allowed">
          <Loader2 size={18} className="animate-spin" />
        </button>
      ) : isRecording ? (
        <button 
          onClick={stopRecording} 
          className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-md animate-pulse"
        >
          <Square size={18} className="fill-current" />
        </button>
      ) : (
        <button 
          onClick={startRecording} 
          className="p-3 bg-navy hover:bg-navy-light text-white rounded-full transition-colors shadow-md"
        >
          <Mic size={18} />
        </button>
      )}
    </div>
  );
}
