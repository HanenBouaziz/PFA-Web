import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import ScanResultDisplay from '../components/scan/ScanResult';
import { useScan } from '../context/ScanContext';
import { ScanResult } from '../types';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { Loader2, Scan, Sparkles } from 'lucide-react';

// Register FilePond plugins
registerPlugin(FilePondPluginImagePreview);

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dxc5curxy',
  },
});

const ScanPage: React.FC = () => {
  const { processImage, isProcessing } = useScan();
  const [files, setFiles] = useState<any[]>([]);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const serverOptions = {
    process: (
      fieldName: string,
      file: File,
      metadata: any,
      load: (fileUrl: string) => void,
      error: (errorText: string) => void,
      progress: (progress: number) => void,
      abort: () => void
    ) => {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'pfa_preset');
      data.append('cloud_name', 'dxc5curxy');

      fetch('https://api.cloudinary.com/v1_1/dxc5curxy/image/upload', {
        method: 'POST',
        body: data,
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Échec de l'upload");

          const result = await res.json();
          if (result && result.secure_url) {
            setImageUrl(result.secure_url);
            setError(null);
            load(result.secure_url);
          } else {
            throw new Error('Réponse Cloudinary invalide');
          }
        })
        .catch((err) => {
          console.error("Erreur lors du téléchargement de l'image:", err);
          setError("Erreur lors du téléchargement de l'image, veuillez réessayer.");
          error("Échec du téléchargement");
          abort();
        });

      return {
        abort: () => {
          abort();
        },
      };
    },
  };

  const handleProcessImage = async () => {
    if (!imageUrl) {
      setError('Veuillez uploader une image avant de la traiter.');
      return;
    }

    try {
      setError(null);
      const result = await processImage(imageUrl);
      setCurrentResult(result);
    } catch (err: any) {
      console.error('Erreur lors du traitement de l\'image:', err);
      setError(err.message || 'Erreur lors du traitement de l\'image.');
    }
  };

  const getPublicIdFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/');
      const filename = pathSegments[pathSegments.length - 1];
      return filename.split('.')[0];
    } catch {
      return null;
    }
  };

  const publicId = imageUrl ? getPublicIdFromUrl(imageUrl) : null;
  const displayImage = publicId ? cld.image(publicId) : null;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with gradient text */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Extract Text from Images
            </h1>
            <p className="mt-2 text-gray-600">
              Upload handwritten or printed documents to extract text with AI
            </p>
          </div>
        </div>
        

        {/* Upload Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Scan className="h-5 w-5 text-indigo-600" />
                Upload Your Document
              </h2>
              {imageUrl && (
                <button
                  onClick={() => {
                    setFiles([]);
                    setImageUrl(null);
                    setCurrentResult(null);
                  }}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Clear
                </button>
              )}
            </div>

            <FilePond
              files={files}
              onupdatefiles={setFiles}
              allowMultiple={false}
              server={serverOptions}
              name="file"
              maxFiles={1}
              acceptedFileTypes={['image/*']}
              labelIdle={
                '<div class="flex flex-col items-center justify-center gap-2 text-gray-500 h-full pt-20">' +
                '<svg class="w-12 h-12 mb-2 text-indigo-400 mt-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>' +
                '</svg>' +
                '<span>Drag & drop your image or <span class="text-indigo-600 font-medium">browse</span></span>' +
                '<span class="text-xs">Supports JPG, PNG (Max 5MB)</span>' +
                '<span class="text-xs text-gray-400 mt-4">Powered by POINA</span>' +
                '</div>'
              }
              className="border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-300 transition-colors h-64" // Hauteur fixe de 64 unités (16rem)
           
            />
          </div>

          {error && (
            <div className="px-6 pb-4">
              <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            </div>
          )}
        </div>

        {/* Image Preview and Process Button */}
        {imageUrl && displayImage && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Document Preview
              </h3>
              <div className="flex justify-center">
                <AdvancedImage
                  cldImg={displayImage.resize(fill().width(500))}
                  className="rounded-lg border border-gray-200 shadow-xs max-w-full h-auto"
                />
              </div>
            </div>

            {!currentResult && !isProcessing && (
              <div className="flex justify-center">
                <button
                  onClick={handleProcessImage}
                  className="group flex items-center justify-center gap-2 px-6 py-3 w-full max-w-md bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <Scan className="h-5 w-5 group-hover:animate-pulse" />
                  Extract Text
                </button>
              </div>
            )}
          </div>
        )}

        {/* Processing and Results */}
        <div className="mt-8 space-y-6">
          {isProcessing && !currentResult && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center">
              <div className="relative">
                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                <div className="absolute inset-0 rounded-full border-2 border-indigo-100 animate-ping opacity-75"></div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Analyzing your document...</p>
              <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
            </div>
          )}

          {currentResult && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <ScanResultDisplay
                result={currentResult}
                isProcessing={isProcessing}
                imageUrl={imageUrl}
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ScanPage;