/**
 * Native MediaRecorder Hook for Voice Memos
 * Implements audio note capture with MediaRecorder API, live duration tracking,
 * real-time microphone level meter, and rigorous hardware track cleanup to avoid memory leaks.
 */

import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseMediaRecorderReturn {
  isRecording: boolean;
  recordingDuration: number; // in seconds
  audioBlob: Blob | null;
  audioUrl: string | null;
  audioLevels: number[]; // real-time visualizer waveform amplitude
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
}

export function useMediaRecorder(): UseMediaRecorderReturn {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>([15, 25, 10, 30, 20]);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Clean up object URLs to prevent memory accumulation
  const cleanupAudioUrl = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  }, [audioUrl]);

  // Clean up hardware streams and audio contexts
  const releaseHardwareResources = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  }, []);

  // Determine best supported MIME type
  const getSupportedMimeType = (): string => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
    ];
    for (const type of types) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  };

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      cleanupAudioUrl();
      setAudioBlob(null);
      setRecordingDuration(0);
      chunksRef.current = [];

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access is not supported by your browser or platform.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // AudioContext Analyser for live waveform visualization in open-pit environments
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 32;
          source.connect(analyser);

          audioCtxRef.current = audioCtx;
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateLevels = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              // Pick 8 representative bars
              const bars = [
                Math.max(10, dataArray[0] / 3),
                Math.max(10, dataArray[1] / 3),
                Math.max(10, dataArray[2] / 3),
                Math.max(10, dataArray[3] / 3),
                Math.max(10, dataArray[4] / 3),
                Math.max(10, dataArray[5] / 3),
                Math.max(10, dataArray[6] / 3),
                Math.max(10, dataArray[7] / 3),
              ];
              setAudioLevels(bars);
              animFrameRef.current = requestAnimationFrame(updateLevels);
            }
          };
          updateLevels();
        }
      } catch (audioErr) {
        console.warn('AudioContext visualizer not available:', audioErr);
      }

      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const finalBlob = new Blob(chunksRef.current, {
          type: mimeType || 'audio/webm',
        });
        setAudioBlob(finalBlob);
        const url = URL.createObjectURL(finalBlob);
        setAudioUrl(url);

        // Terminate hardware audio track immediately
        releaseHardwareResources();
      };

      // Request data every 500ms
      mediaRecorder.start(500);
      setIsRecording(true);

      // Duration counter
      const startTime = Date.now();
      timerRef.current = window.setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 200);
    } catch (err: any) {
      setError(err?.message || 'Failed to acquire microphone access.');
      releaseHardwareResources();
      setIsRecording(false);
    }
  }, [cleanupAudioUrl, releaseHardwareResources]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
  }, []);

  // Reset recording
  const resetRecording = useCallback(() => {
    stopRecording();
    cleanupAudioUrl();
    setAudioBlob(null);
    setRecordingDuration(0);
    setError(null);
    setAudioLevels([15, 25, 10, 30, 20]);
    releaseHardwareResources();
  }, [stopRecording, cleanupAudioUrl, releaseHardwareResources]);

  // Ensure thorough hardware teardown on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      releaseHardwareResources();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [releaseHardwareResources, audioUrl]);

  return {
    isRecording,
    recordingDuration,
    audioBlob,
    audioUrl,
    audioLevels,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  };
}

