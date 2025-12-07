import React, { useRef } from 'react';
import { Button, Card, CardBody, CardHeader, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';

type Props = {
  imageUrl?: string;
  uploading: boolean;
  removing: boolean;
  placeholderInitial?: string;
  disabled?: boolean;
  disabledMessage?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
};

const AvatarUploader: React.FC<Props> = ({
  imageUrl,
  uploading,
  removing,
  placeholderInitial = 'U',
  disabled = false,
  disabledMessage,
  onUpload,
  onRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectFile = () => {
    if (disabled) {
      return;
    }
    fileInputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!disabled) {
        onUpload(file);
      }
      event.target.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (!disabled) {
        onUpload(file);
      }
    }
  };

  return (
    <Card className="shadow-sm border-0 h-100">
      <CardHeader className="bg-white">
        <div>
          <h6 className="mb-1">Avatar</h6>
          <p className="mb-0 text-muted small">Upload a photo to personalize your profile.</p>
        </div>
      </CardHeader>
      <CardBody className="d-flex flex-column align-items-center">
        <div className="avatar-uploader__preview mb-3" onDragOver={event => event.preventDefault()} onDrop={handleDrop} role="presentation">
          {imageUrl ? <img src={imageUrl} alt="Avatar" /> : <div className="avatar-uploader__placeholder">{placeholderInitial}</div>}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="d-none" onChange={handleChange} />
        <div className="d-flex flex-column gap-2 w-100">
          <Button color="primary" outline onClick={handleSelectFile} disabled={uploading || removing || disabled}>
            {uploading ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faUpload} className="me-2" />}
            Upload new photo
          </Button>
          <Button color="danger" outline onClick={onRemove} disabled={removing || uploading || disabled}>
            {removing ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faTrash} className="me-2" />}
            Remove photo
          </Button>
        </div>
        <div className="text-muted small text-center mt-3">
          {disabled && disabledMessage ? (
            <span>{disabledMessage}</span>
          ) : (
            'Recommended: square JPG/PNG under 2MB. Drag & drop works if your browser supports it.'
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default AvatarUploader;
