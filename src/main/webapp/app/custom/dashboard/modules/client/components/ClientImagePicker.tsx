import React, { CSSProperties, useEffect, useState } from 'react';
import axios from 'axios';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTrash } from '@fortawesome/free-solid-svg-icons';

import ClientAvatar from './ClientAvatar';

import './ClientImagePicker.scss';

interface ClientImagePickerProps {
  name: string;
  photoUrl?: string;
  onChange: (url: string | null) => void;
  size?: number;
}

interface UploadResponse {
  url: string;
}

const ACCEPT_TYPES = ['jpg', 'jpeg', 'png', 'webp'];

const ClientImagePicker: React.FC<ClientImagePickerProps> = ({ name, photoUrl, onChange, size = 120 }) => {
  const safeSize = Number.isFinite(size) && size > 0 ? size : 120;
  const [images, setImages] = useState<ImageListType>([]);
  const [preview, setPreview] = useState<string | null>(photoUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreview(photoUrl ?? null);
    if (!photoUrl) {
      setImages([]);
    }
  }, [photoUrl]);

  const dimensionStyle: CSSProperties = {
    width: safeSize,
    height: safeSize,
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post<UploadResponse>('/api/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.url ?? null;
  };

  const handleImageChange = async (imageList: ImageListType) => {
    setError(null);
    setImages(imageList);
    const image = imageList[0];

    if (image?.data_url && image.file) {
      const previousUrl = preview;
      setPreview(image.data_url);
      setUploading(true);
      try {
        const uploadedUrl = await uploadImage(image.file);
        if (!uploadedUrl) {
          throw new Error('UPLOAD_FAILED');
        }
        setPreview(uploadedUrl);
        onChange(uploadedUrl);
      } catch (err) {
        setPreview(previousUrl ?? null);
        setImages([]);
        setError('Impossible de téléverser cette image.');
      } finally {
        setUploading(false);
      }
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  const handleRemove = () => {
    setImages([]);
    setPreview(null);
    setError(null);
    onChange(null);
  };

  return (
    <div className="client-image-picker" style={dimensionStyle}>
      <ImageUploading
        value={images}
        onChange={handleImageChange}
        dataURLKey="data_url"
        multiple={false}
        maxNumber={1}
        acceptType={ACCEPT_TYPES}
      >
        {({ onImageUpload, isDragging, dragProps }) => (
          <>
            <button
              type="button"
              className="client-image-picker__avatar-btn"
              style={dimensionStyle}
              onClick={onImageUpload}
              aria-label="Changer la photo du client"
              disabled={uploading}
              {...dragProps}
            >
              {preview ? (
                <img src={preview} alt={name} className="client-image-picker__image" style={dimensionStyle} />
              ) : (
                <div className="client-image-picker__avatar-fallback" style={dimensionStyle}>
                  <ClientAvatar name={name} photoUrl={undefined} size={safeSize} />
                </div>
              )}
              <div className="client-image-picker__overlay" style={isDragging || uploading ? { opacity: 1 } : undefined}>
                <FontAwesomeIcon icon={faCamera} />
                <span>{uploading ? 'Téléversement...' : 'Changer la photo'}</span>
              </div>
            </button>
            {preview ? (
              <button
                type="button"
                className="client-image-picker__remove-btn"
                onClick={handleRemove}
                aria-label="Supprimer la photo"
                disabled={uploading}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            ) : null}
          </>
        )}
      </ImageUploading>
      {error ? <div className="text-danger small mt-2 text-center">{error}</div> : null}
    </div>
  );
};

export default ClientImagePicker;
