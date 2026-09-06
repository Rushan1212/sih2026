import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, RotateCcw, Trash2 } from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface AudioVoiceMemoPlayerProps {
  audioBlob?: Blob;
  audioUrl?: string;
  onDiscard?: () => void;
  title?: string;
}

export const AudioVoiceMemoPlayer: React.FC<AudioVoiceMemoPlayerProps> = ({
  audioBlob,
  audioUrl: initialUrl,
  onDiscard,
  title = 'Voice Note Field Memo',
}) => {
  const [url, setUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Manage Blob URL lifecycle
  useEffect(() => {
    let createdUrl: string | null = null;
    if (audioBlob) {
      createdUrl = URL.createObjectURL(audioBlob);
      setUrl(createdUrl);
    } else if (initialUrl) {
      setUrl(initialUrl);
    }

    return () => {
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [audioBlob, initialUrl]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    soundManager.playClick();
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn('Playback blocked or failed:', e);
      });
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!url) return null;

  return (
    <div className="bg-graphite/60 border border-amber/20 rounded-lg p-3.5 backdrop-blur-md relative overflow-hidden group">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-amber animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-offwhite/90 font-medium">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-dim">
            {formatTime(currentTime)} / {formatTime(duration || 0)}
          </span>
          {onDiscard && (
            <button
              onClick={onDiscard}
              type="button"
              className="text-dim hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/10"
              title="Discard Voice Memo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Scrub bar & Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-amber/20 hover:bg-amber/30 border border-amber/40 text-amber flex items-center justify-center transition-all duration-200 active:scale-95"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-amber" /> : <Play className="w-4 h-4 fill-amber translate-x-0.5" />}
        </button>

        <div className="flex-1 flex flex-col justify-center">
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-coal rounded-lg appearance-none cursor-pointer accent-amber"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              setCurrentTime(0);
            }
          }}
          className="text-dim hover:text-offwhite transition-colors p-1"
          title="Restart audio"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

