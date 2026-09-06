import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, X, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface LiveCameraViewfinderProps {
  imageBlob: Blob | null;
  onImageCaptured: (blob: Blob) => void;
  onImageCleared: () => void;
}

export const LiveCameraViewfinder: React.FC<LiveCameraViewfinderProps> = ({
  imageBlob,
  onImageCaptured,
  onImageCleared,
}) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Manage Blob preview URL
  useEffect(() => {
    let url: string | null = null;
    if (imageBlob) {
      url = URL.createObjectURL(imageBlob);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [imageBlob]);

  // Teardown camera stream
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream]);

  // Start live viewfinder
  const startCamera = async () => {
    try {
      soundManager.playClick();
      setCameraError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not accessible in this environment. Use file upload below.');
      }

      // Prefer rear environment camera on industrial tablets
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Live viewfinder unavailable:', err);
      setCameraError(err?.message || 'Could not initialize live camera. Please use standard capture.');
      stopCameraStream();
    }
  };

  // Capture frame from video to canvas
  const captureSnapshot = () => {
    if (!videoRef.current) return;

    soundManager.playClick();
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onImageCaptured(blob);
            stopCameraStream();
            soundManager.playSuccess();
          }
        },
        'image/jpeg',
        0.88
      );
    }
  };

  // Handle native file input fallback (with capture="environment")
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      soundManager.playClick();
      onImageCaptured(file);
      soundManager.playSuccess();
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden native input with capture="environment" for ruggedized Android/iOS mine tablets */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* State 1: Captured Image Preview */}
      {previewUrl && !isCameraActive && (
        <div className="relative rounded-xl overflow-hidden border border-teal/40 bg-coal/80 group aspect-video flex items-center justify-center">
          <img
            src={previewUrl}
            alt="Hazard Evidence"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coal/90 via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-coal/80 backdrop-blur-md border border-teal/30 text-[11px] font-mono text-teal">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
            <span>OPTICAL EVIDENCE LOGGED</span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onImageCleared();
              }}
              className="p-1.5 rounded-full bg-coal/80 hover:bg-red-500/20 border border-dim/30 hover:border-red-500/40 text-dim hover:text-red-400 transition-colors"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Retake action */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onImageCleared();
                startCamera();
              }}
              className="px-3 py-1.5 rounded-lg bg-coal/90 hover:bg-amber/20 border border-amber/30 text-amber text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retake
            </button>
          </div>
        </div>
      )}

      {/* State 2: Live Viewfinder */}
      {isCameraActive && (
        <div className="relative rounded-xl overflow-hidden border-2 border-amber/50 bg-coal aspect-video flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="w-full h-full object-cover"
          />

          {/* HUD Crosshairs for Open-Pit Mining Inspection */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-32 h-32 border border-amber/30 border-dashed rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 border-t-2 border-l-2 border-amber" />
              <div className="w-3 h-3 border-t-2 border-r-2 border-amber ml-auto" />
            </div>
          </div>

          {/* Shutter bar */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={captureSnapshot}
              className="px-5 py-2 rounded-full bg-amber hover:bg-amber/90 text-coal font-bold font-mono text-sm flex items-center gap-2 shadow-amber-glow transition-transform active:scale-95"
            >
              <Camera className="w-4 h-4" />
              LOG SHUTTER
            </button>
            <button
              type="button"
              onClick={stopCameraStream}
              className="p-2 rounded-full bg-coal/80 hover:bg-coal border border-dim/30 text-dim hover:text-offwhite transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* State 3: Empty Placeholder with Capture Actions */}
      {!previewUrl && !isCameraActive && (
        <div className="border border-dashed border-amber/20 hover:border-amber/40 rounded-xl p-6 bg-graphite/30 backdrop-blur-sm transition-all duration-300 text-center">
          <div className="w-12 h-12 rounded-xl bg-amber/10 border border-amber/20 text-amber flex items-center justify-center mx-auto mb-3">
            <Camera className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-offwhite mb-1">
            Optical Hazard Imagery
          </h4>
          <p className="text-xs text-dim mb-4 max-w-sm mx-auto">
            Capture cracks, highwall slope shear, seam gas seepages, or equipment failures.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={startCamera}
              className="px-4 py-2 rounded-lg bg-amber/15 hover:bg-amber/25 border border-amber/30 text-amber text-xs font-mono font-medium flex items-center gap-2 transition-all active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
              Open Live Shutter
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg bg-slate/40 hover:bg-slate/60 border border-slate/60 text-offwhite text-xs font-mono flex items-center gap-2 transition-all active:scale-95"
            >
              <ImageIcon className="w-3.5 h-3.5 text-teal" />
              Select Photo / File
            </button>
          </div>

          {cameraError && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-amber/80 font-mono">
              <AlertCircle className="w-3.5 h-3.5 text-amber" />
              <span>{cameraError}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

