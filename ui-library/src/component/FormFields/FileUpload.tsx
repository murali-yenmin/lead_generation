import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { FileUploadProps } from '../../interfaces/formFields';
import ErrorValidation from '../ErrorValidation';

export const FileUpload = ({
  id,
  name,
  label,
  allowedFileTypes,
  control,
  error,
  required = false,
  onChange,
}: FileUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create the 'accept' string dynamically
  const acceptedTypes = allowedFileTypes ? allowedFileTypes.join(',') : 'image/*';

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="file-upload-container">
      <label htmlFor={id}>
        {label}
        {required && <span>*</span>}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={id}
            type="file"
            accept={acceptedTypes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const selectedFile = e.target.files?.[0];

              if (selectedFile) {
                // Validate file type
                if (allowedFileTypes && !allowedFileTypes.includes(selectedFile.type)) {
                  field.onChange(null);
                  setPreview(null);
                  return;
                }

                // Set file preview
                setPreview(URL.createObjectURL(selectedFile));
                onChange?.(selectedFile);
                field.onChange(selectedFile);
              }
            }}
          />
        )}
      />

      {/* Display error message if file type is invalid */}
      {error && <ErrorValidation errors={error} name={label.toLowerCase()} />}

      {preview && (
        <div className="file-preview">
          {/* Icon for file preview */}
          <button onClick={toggleModal} style={{ cursor: 'pointer' }}>
            <img
              src={preview}
              alt="file preview"
              width={50}
              height={50}
              style={{ objectFit: 'cover' }}
            />
          </button>

          {/* Modal to show file */}
          {isModalOpen && (
            <button
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={toggleModal}
            >
              <h2>File Preview</h2>
              <img src={preview} alt="file preview" style={{ width: '400px', height: 'auto' }} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
