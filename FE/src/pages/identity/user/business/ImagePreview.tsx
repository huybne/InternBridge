import React from 'react';
import './VerifyBusinessForm.css';

interface ImagePreviewProps {
  images: File[];
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="image-preview-container">
      {images.map((image, index) => {
        if (!(image instanceof File)) return null; // tránh lỗi createObjectURL

        return (
          <div className="image-preview" key={index}>
            <img
              src={URL.createObjectURL(image)}
              alt={`preview-${index}`}
              className="preview-img"
            />
          </div>
        );
      })}
    </div>
  );
};

export default ImagePreview;
