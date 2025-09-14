import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Camera, Upload as UploadIcon, X, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { DeviceUploadFormData } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DeviceUpload: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { 
    register, 
    handleSubmit, 
    control,
    watch,
    reset,
    formState: { errors } 
  } = useForm<DeviceUploadFormData>();

  const deviceTypes = [
    { value: 'smartphone', label: 'Smartphone' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'desktop', label: 'Desktop Computer' },
    { value: 'battery', label: 'Battery' },
    { value: 'other', label: 'Other' },
  ];

  const conditions = [
    { value: 'excellent', label: 'Excellent', description: 'Like new, fully functional' },
    { value: 'good', label: 'Good', description: 'Minor wear, fully functional' },
    { value: 'fair', label: 'Fair', description: 'Visible wear, mostly functional' },
    { value: 'poor', label: 'Poor', description: 'Significant wear, limited functionality' },
  ];

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - uploadedImages.length);
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const onSubmit = async (data: DeviceUploadFormData) => {
    try {
      setIsUploading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form data:', { ...data, images: uploadedImages });
      
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        reset();
        setUploadedImages([]);
      }, 3000);
      
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-neutral-800 mb-2">
            Device Uploaded Successfully!
          </h2>
          <p className="text-neutral-600 mb-6">
            Your device has been added and will be processed soon. You'll receive a QR code for tracking.
          </p>
          <button
            onClick={() => setUploadSuccess(false)}
            className="btn-primary"
          >
            Upload Another Device
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-neutral-800 mb-4">
          Upload Your Device
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Help us process your device efficiently by providing accurate information. Our AI will assist in identifying your device and suggesting the best disposal method.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Image Upload Section */}
        <div className="card">
          <h2 className="text-xl font-display font-semibold text-neutral-800 mb-6">
            Device Photos
          </h2>
          
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
              dragActive 
                ? 'border-primary-400 bg-primary-50' 
                : 'border-neutral-300 hover:border-primary-400 hover:bg-primary-50/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => handleImageUpload(e.target.files)}
              disabled={uploadedImages.length >= 5}
            />
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-neutral-800 mb-2">
                  Drop photos here or click to upload
                </p>
                <p className="text-sm text-neutral-600">
                  Upload up to 5 photos of your device. Include front, back, and any damage.
                </p>
                <p className="text-xs text-neutral-500 mt-2">
                  Supports: JPG, PNG, WebP (Max 5MB each)
                </p>
              </div>
            </div>
          </div>

          {/* Uploaded Images Preview */}
          {uploadedImages.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-neutral-700 mb-3">
                Uploaded Photos ({uploadedImages.length}/5)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {uploadedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Device ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-neutral-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Device Information */}
        <div className="card">
          <h2 className="text-xl font-display font-semibold text-neutral-800 mb-6">
            Device Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Device Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Device Type *
              </label>
              <select
                {...register('type', { required: 'Device type is required' })}
                className="input-field"
              >
                <option value="">Select device type</option>
                {deviceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Brand
              </label>
              <input
                {...register('brand')}
                type="text"
                className="input-field"
                placeholder="e.g., Apple, Samsung, Dell"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Model
              </label>
              <input
                {...register('model')}
                type="text"
                className="input-field"
                placeholder="e.g., iPhone 13, MacBook Pro"
              />
            </div>

            {/* Serial Number */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Serial Number
              </label>
              <input
                {...register('serialNumber')}
                type="text"
                className="input-field"
                placeholder="Enter serial number if available"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Approximate Weight (kg)
              </label>
              <input
                {...register('weight', { 
                  valueAsNumber: true,
                  min: { value: 0.1, message: 'Weight must be at least 0.1 kg' }
                })}
                type="number"
                step="0.1"
                className="input-field"
                placeholder="e.g., 0.5"
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Condition Assessment */}
        <div className="card">
          <h2 className="text-xl font-display font-semibold text-neutral-800 mb-6">
            Device Condition
          </h2>
          
          <div className="space-y-4">
            {conditions.map((condition) => (
              <label
                key={condition.value}
                className="flex items-start p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors"
              >
                <input
                  {...register('condition', { required: 'Please select device condition' })}
                  type="radio"
                  value={condition.value}
                  className="mt-1 mr-4 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="font-medium text-neutral-800">{condition.label}</div>
                  <div className="text-sm text-neutral-600 mt-1">{condition.description}</div>
                </div>
              </label>
            ))}
            {errors.condition && (
              <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="card">
          <h2 className="text-xl font-display font-semibold text-neutral-800 mb-6">
            Additional Information
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="input-field resize-none"
              placeholder="Any additional details about the device, damage, or special considerations..."
            />
          </div>
        </div>

        {/* AI Processing Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 mb-2">AI-Powered Processing</h3>
              <p className="text-sm text-blue-700">
                Once uploaded, our AI will analyze your device photos to confirm type and condition. 
                OCR technology will extract serial numbers and model information to provide accurate 
                valuation and disposal recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isUploading || uploadedImages.length === 0}
            className="btn-primary flex items-center space-x-2 px-8 py-4"
          >
            {isUploading ? (
              <>
                <LoadingSpinner size="small" color="white" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <UploadIcon className="w-5 h-5" />
                <span>Upload Device</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default DeviceUpload;