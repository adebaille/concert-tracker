import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { getCroppedImage } from "../lib/cropImage";
import "../styles/image-cropper.css";

type ImageCropperProps = {
  imageSrc: string;
  aspect?: number; // optionnel : absent = ratio libre
  onCancel: () => void;
  onCropped: (blob: Blob) => void;
};

function ImageCropper({
  imageSrc,
  aspect,
  onCancel,
  onCropped,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Appelé par react-easy-crop à chaque déplacement/zoom : on garde la zone finale en pixels
  const onCropComplete = useCallback((_croppedArea: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  async function handleValidate() {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const blob = await getCroppedImage(imageSrc, croppedAreaPixels);
      onCropped(blob);
    } catch {
      setIsProcessing(false);
    }
  }

  return (
    <div className="cropper-backdrop" onClick={onCancel}>
      <div className="cropper-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cropper-area">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="cropper-controls">
          <label className="cropper-zoom-label">Zoom</label>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="cropper-zoom-slider"
          />
        </div>

        <div className="cropper-actions">
          <button
            type="button"
            className="btn-ghost"
            onClick={onCancel}
            disabled={isProcessing}>
            Annuler
          </button>
          <button
            type="button"
            className="btn-ghost primary"
            onClick={handleValidate}
            disabled={isProcessing || !croppedAreaPixels}>
            {isProcessing ? "Traitement..." : "Valider le cadrage"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropper;
