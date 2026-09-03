"use client";

import { useState, useEffect, useCallback } from "react";
import { athletes as initialAthletes, type Athlete, type MerchandiseItem } from "../../lib/athletes";
import { fetchAthletes, createAthlete as apiCreateAthlete, updateAthlete as apiUpdateAthlete, deleteAthlete as apiDeleteAthlete } from "../../lib/api";
import { type Product } from "../../lib/products";
import { fetchProducts as fetchAllProducts, apiCreateProduct, apiUpdateProduct, apiDeleteProduct } from "../../lib/api";
import Cropper, { Area } from 'react-easy-crop';

// Password protection component
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Allow dev bypass for testing
    if (process.env.NEXT_PUBLIC_DEV_BYPASS === 'true') {
      try { await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'login', dev: true }) }); } catch {}
      onLogin();
      return;
    }
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'login', email, password }) });
      if (res.ok) { onLogin(); setError(''); return; }
    } catch {}
    setError('Invalid credentials.');
    setAttempts(prev => prev + 1);
    setPassword('');
    if (attempts >= 2) {
      setError('Too many failed attempts. Please wait 30 seconds.');
      setTimeout(() => { setAttempts(0); setError(''); }, 30000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 flex items-center justify-center">
      <div className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Access
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter the admin password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Email</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200" placeholder="christopergill@optimalsports.net" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Password</label>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200" placeholder="Enter admin password" disabled={attempts>=3} required />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={attempts >= 3}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
          >
            {attempts >= 3 ? 'Access Locked' : 'Access Admin'}
          </button>

          <div className="mt-4 text-center">
            <button type="button" className="text-sm text-red-600 hover:text-red-700" onClick={async()=>{
              if (email.toLowerCase() !== 'christopergill@optimalsports.net') {
                alert('Password reset emails can only be sent to christopergill@optimalsports.net');
                return;
              }
              const emailPrompt = email || prompt('Enter your email for reset link') || '';
              if (!emailPrompt) return;
              await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'forgot', email: emailPrompt }) });
              alert('If the email exists, a reset link has been sent.');
            }}>Forgot password?</button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Unauthorized access is prohibited and monitored.
          </p>
        </div>
      </div>
    </div>
  );
}

interface AthleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  athlete?: Omit<Athlete, 'slug'>;
  onSave: (athlete: Omit<Athlete, 'slug'>) => void;
  mode: 'add' | 'edit';
}

function AthleteModal({ isOpen, onClose, athlete, onSave, mode }: AthleteModalProps) {
  const [formData, setFormData] = useState<Omit<Athlete, 'slug'>>({
    name: '',
    position: '',
    school: '',
    conference: '',
    classYear: '',
    number: '',
    image: '',
    bio: '',
    colors: { from: 'from-blue-600', to: 'to-blue-600' },
    stats: {
      passingYards: 0,
      rushingYards: 0,
      receivingYards: 0,
      touchdowns: 0,
      interceptions: 0,
      tackles: 0,
      sacks: 0
    },
    hasMerchandise: false,
    merchandise: []
  });

  // Determine if athlete is NFL based on conference
  const isNFL = formData.conference === 'NFL';

  // Image cropping state
  const [showCrop, setShowCrop] = useState(false);
  const [cropImage, setCropImage] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState<number>(3 / 4); // Default portrait aspect ratio
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    if (athlete) {
      setFormData(athlete);
    } else {
      setFormData({
        name: '',
        position: '',
        school: '',
        conference: '',
        classYear: '',
        number: '',
        image: '',
        bio: '',
        colors: { from: 'from-blue-600', to: 'to-blue-600' },
        stats: {
          passingYards: 0,
          rushingYards: 0,
          receivingYards: 0,
          touchdowns: 0,
          interceptions: 0,
          tackles: 0,
          sacks: 0
        },
        hasMerchandise: false,
        merchandise: []
      });
    }
  }, [athlete]);

  const createImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      
      // Try with CORS first for external images
      if (!url.startsWith('data:') && !url.startsWith('blob:')) {
        image.crossOrigin = 'anonymous';
      }
      
      let attemptWithCORS = true;
      
      const loadWithCORS = () => {
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', () => {
          if (attemptWithCORS && !url.startsWith('data:') && !url.startsWith('blob:')) {
            // Retry without CORS
            attemptWithCORS = false;
            image.crossOrigin = null;
            image.src = url;
          } else {
            console.error('Error loading image:', url);
            reject(new Error('Failed to load image'));
          }
        });
        image.src = url;
      };
      
      loadWithCORS();
    });
  };

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          // Convert blob to base64 data URL so it persists
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = () => {
            reject(new Error('Failed to convert blob to base64'));
          };
          reader.readAsDataURL(blob);
        }, 'image/jpeg', 0.95);
      } catch (error) {
        console.error('Canvas tainted error:', error);
        // If canvas is tainted, try to get the image from source directly
        reject(error);
      }
    });
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!croppedAreaPixels) return;
    
    try {
      const croppedImageUrl = await getCroppedImg(cropImage, croppedAreaPixels);
      console.log('Cropped image URL type:', typeof croppedImageUrl);
      console.log('Cropped image URL length:', croppedImageUrl.length);
      console.log('Cropped image URL preview:', croppedImageUrl.substring(0, 50));
      setFormData({ ...formData, image: croppedImageUrl });
      setShowCrop(false);
      setCropImage('');
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {mode === 'add' ? 'Add New Athlete' : 'Edit Athlete'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                placeholder="Athlete Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Position *
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                placeholder="QB, RB, WR, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                School / Team *
              </label>
              <input
                type="text"
                required
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                placeholder={isNFL ? "NFL Team Name" : "University Name"}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                League *
              </label>
              <select
                required
                value={isNFL ? 'NFL' : 'College'}
                onChange={(e) => {
                  const league = e.target.value;
                  if (league === 'NFL') {
                    setFormData({ 
                      ...formData, 
                      conference: 'NFL'
                    });
                  } else {
                    setFormData({ 
                      ...formData, 
                      conference: formData.conference === 'NFL' ? '' : formData.conference
                    });
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
              >
                <option value="College">College</option>
                <option value="NFL">NFL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Conference {isNFL ? '(Auto-set to NFL)' : '*'}
            </label>
            {isNFL ? (
              <input
                type="text"
                value="NFL"
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            ) : (
              <input
                type="text"
                required={!isNFL}
                value={formData.conference}
                onChange={(e) => setFormData({ ...formData, conference: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                placeholder="Big Ten, SEC, ACC, etc."
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jersey Number
              </label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                placeholder="1, 23, 99, etc."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                placeholder="https://example.com/image.jpg or /public/path.jpg"
              />
              <a
                href="https://cloudinary.com/console/media_library" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm text-gray-800 dark:text-gray-200 hover:border-red-500"
                title="Open Cloudinary to upload and copy a direct image URL"
              >
                Get image link
              </a>
              <label className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm text-gray-800 dark:text-gray-200 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    // Create a local object URL for cropping
                    const localUrl = URL.createObjectURL(file);
                    setCropImage(localUrl);
                    setShowCrop(true);
                  }}
                />
                Upload
              </label>
              {formData.image && (
                <button
                  type="button"
                  onClick={() => {
                    setCropImage(formData.image);
                    setShowCrop(true);
                  }}
                  className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm text-gray-800 dark:text-gray-200"
                >
                  Crop Image
                </button>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Using a hosted URL is recommended for production. Upload sets a temporary local URL for preview; persist by uploading to /public and saving the path.</p>
            {formData.image && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Current Image Preview:</p>
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="max-w-xs max-h-48 rounded-lg border border-gray-300 dark:border-neutral-600 object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', formData.image.substring(0, 100));
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
              placeholder="Tell us about this athlete..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Color
              </label>
              <select
                value={formData.colors.from}
                onChange={(e) => setFormData({
                  ...formData,
                  colors: { ...formData.colors, from: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
              >
                <option value="from-blue-600">Blue</option>
                <option value="from-red-600">Red</option>
                <option value="from-green-600">Green</option>
                <option value="from-purple-600">Purple</option>
                <option value="from-orange-600">Orange</option>
                <option value="from-yellow-500">Yellow</option>
                <option value="from-gray-600">Gray</option>
                <option value="from-black">Black</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secondary Color
              </label>
              <select
                value={formData.colors.to}
                onChange={(e) => setFormData({
                  ...formData,
                  colors: { ...formData.colors, to: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
              >
                <option value="to-blue-600">Blue</option>
                <option value="to-red-600">Red</option>
                <option value="to-green-600">Green</option>
                <option value="to-purple-600">Purple</option>
                <option value="to-orange-600">Orange</option>
                <option value="to-yellow-500">Yellow</option>
                <option value="to-gray-600">Gray</option>
                <option value="to-white">White</option>
                <option value="to-black">Black</option>
              </select>
            </div>
          </div>
          
          {/* Merchandise Section */}
          <div className="pt-4 border-t border-gray-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Merchandise</h3>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasMerchandise}
                  onChange={(e) => setFormData({
                    ...formData,
                    hasMerchandise: e.target.checked,
                    merchandise: e.target.checked ? formData.merchandise : []
                  })}
                  className="sr-only"
                />
                <div className={`relative w-10 h-5 transition-colors duration-200 ease-in-out rounded-full ${formData.hasMerchandise ? 'bg-red-600' : 'bg-gray-300 dark:bg-neutral-600'}`}>
                  <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${formData.hasMerchandise ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  This athlete has merchandise
                </span>
              </label>
            </div>
            
            {formData.hasMerchandise && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add merchandise items for this athlete. You can add photos and links to their products.
                </p>
                
                {formData.merchandise && formData.merchandise.map((item, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg border border-gray-200 dark:border-neutral-600">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Item #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newMerchandise = formData.merchandise?.filter((_, i) => i !== index) || [];
                          setFormData({ ...formData, merchandise: newMerchandise });
                        }}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newMerchandise = [...(formData.merchandise || [])];
                            newMerchandise[index] = { ...item, name: e.target.value };
                            setFormData({ ...formData, merchandise: newMerchandise });
                          }}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-neutral-600 rounded focus:ring-1 focus:ring-red-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                          placeholder="T-Shirt, Jersey, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Price
                        </label>
                        <input
                          type="text"
                          value={item.price}
                          onChange={(e) => {
                            const newMerchandise = [...(formData.merchandise || [])];
                            newMerchandise[index] = { ...item, price: e.target.value };
                            setFormData({ ...formData, merchandise: newMerchandise });
                          }}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-neutral-600 rounded focus:ring-1 focus:ring-red-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                          placeholder="$29.99"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={item.image}
                          onChange={(e) => {
                            const newMerchandise = [...(formData.merchandise || [])];
                            newMerchandise[index] = { ...item, image: e.target.value };
                            setFormData({ ...formData, merchandise: newMerchandise });
                          }}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-neutral-600 rounded focus:ring-1 focus:ring-red-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                          placeholder="https://example.com/product.jpg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Purchase Link
                        </label>
                        <input
                          type="url"
                          value={item.link}
                          onChange={(e) => {
                            const newMerchandise = [...(formData.merchandise || [])];
                            newMerchandise[index] = { ...item, link: e.target.value };
                            setFormData({ ...formData, merchandise: newMerchandise });
                          }}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-neutral-600 rounded focus:ring-1 focus:ring-red-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                          placeholder="https://store.example.com/product"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => {
                    const newItem: MerchandiseItem = {
                      id: Date.now().toString(),
                      name: '',
                      image: '',
                      price: '',
                      link: ''
                    };
                    setFormData({
                      ...formData,
                      merchandise: [...(formData.merchandise || []), newItem]
                    });
                  }}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Merchandise Item
                </button>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              {mode === 'add' ? 'Add Athlete' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-neutral-600 dark:hover:bg-neutral-500 text-gray-700 dark:text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Image Crop Modal */}
      {showCrop && cropImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Crop Image
              </h2>
              <button
                onClick={() => {
                  setShowCrop(false);
                  setCropImage('');
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setAspectRatio(3 / 4);
                  setCroppedAreaPixels(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="relative" style={{ width: '100%', height: '500px', background: '#333' }}>
              <Cropper
                key={aspectRatio}
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio === 0 ? undefined : aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-neutral-700 space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <strong>Instructions:</strong> Drag the image to reposition, use the zoom slider below, and adjust the aspect ratio if needed. Click and drag the crop area to focus on the athlete&apos;s face or any specific area.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Aspect Ratio
                </label>
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setAspectRatio(3 / 4)}
                    className={`px-3 py-1 rounded ${aspectRatio === 3 / 4 ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    Portrait (3:4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio(4 / 3)}
                    className={`px-3 py-1 rounded ${aspectRatio === 4 / 3 ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    Landscape (4:3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio(1)}
                    className={`px-3 py-1 rounded ${aspectRatio === 1 ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    Square (1:1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio(0)}
                    className={`px-3 py-1 rounded ${aspectRatio === 0 ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    Free (No Ratio)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Zoom: {zoom.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={5}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Zoom Out</span>
                  <span>Zoom In</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCropSave}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Save Crop
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCrop(false);
                    setCropImage('');
                    setCrop({ x: 0, y: 0 });
                    setZoom(1);
                    setAspectRatio(3 / 4);
                    setCroppedAreaPixels(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-neutral-600 dark:hover:bg-neutral-500 text-gray-700 dark:text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [athletes, setAthletes] = useState<Athlete[]>(initialAthletes);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [executives, setExecutives] = useState<any[]>([]);

  // Always require login every visit (no persistence)
  useEffect(() => {
    try { sessionStorage.removeItem('adminAuthenticated'); } catch {}
  }, []);

  const loadAthletes = async () => {
    setLoading(true);
    try {
      // Use direct fetch like executives section
      const res = await fetch('/api/athletes', { cache: 'no-store' });
      const fetchedAthletes = res.ok ? await res.json() : [];
      console.log('Loaded athletes:', fetchedAthletes.length);
      setAthletes(fetchedAthletes);
    } catch (error) {
      console.error('Error loading athletes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      // Use direct fetch like executives section
      const res = await fetch('/api/products', { cache: 'no-store' });
      const fetched = res.ok ? await res.json() : [];
      console.log('Loaded products:', fetched.length);
      setProducts(fetched);
    } catch (e) {
      console.error('Error loading products', e);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadAthletes();
      loadProducts();
      loadExecutives();
    }
  }, [isAuthenticated]);

  const loadExecutives = async () => {
    try {
      const res = await fetch('/api/executives', { cache: 'no-store' });
      const data = res.ok ? await res.json() : [];
      setExecutives(data);
    } catch {}
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    loadAthletes();
    loadProducts();
    loadExecutives();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try { sessionStorage.removeItem('adminAuthenticated'); } catch {}
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const filteredAthletes = athletes.filter(athlete =>
    athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateSlug = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    console.log('Generated slug for', name, ':', slug);
    return slug;
  };

  const handleAddAthlete = async (athleteData: Omit<Athlete, 'slug'>) => {
    setLoading(true);
    try {
      const slug = generateSlug(athleteData.name);
      const newAthlete: Athlete = {
        ...athleteData,
        slug: slug
      };
      
      console.log('Creating athlete with slug:', slug, 'Full athlete:', newAthlete);
      
      // Use direct fetch like executives section
      const response = await fetch('/api/athletes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAthlete),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const createdAthlete = await response.json();
        console.log('Created athlete response:', createdAthlete);
        setAthletes([...athletes, createdAthlete]);
        setShowAddModal(false);
        alert('Athlete created successfully!');
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        alert('Failed to create athlete. Please try again.');
      }
    } catch (error) {
      console.error('Error adding athlete:', error);
      alert('Failed to create athlete. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAthlete = (athlete: Athlete) => {
    setEditingAthlete(athlete);
  };

  const handleSaveEdit = async (athleteData: Omit<Athlete, 'slug'>) => {
    if (!editingAthlete) return;
    
    setLoading(true);
    try {
      const updatedAthlete = { ...athleteData, slug: editingAthlete.slug };
      console.log('Saving athlete with image:', updatedAthlete.image);
      console.log('Image length:', updatedAthlete.image?.length);
      console.log('Image preview:', updatedAthlete.image?.substring(0, 50));
      const result = await apiUpdateAthlete(editingAthlete.slug, updatedAthlete);
      
      if (result) {
        console.log('Athlete updated successfully. Result image:', result.image?.substring(0, 50));
        const updatedAthletes = athletes.map(athlete =>
          athlete.slug === editingAthlete.slug ? result : athlete
        );
        setAthletes(updatedAthletes);
        setEditingAthlete(null);
        alert('Athlete updated successfully! Refresh the athlete page to see changes.');
      } else {
        alert('Failed to update athlete. Please try again.');
      }
    } catch (error) {
      console.error('Error updating athlete:', error);
      alert('Failed to update athlete. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAthlete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this athlete?')) return;
    
    setLoading(true);
    try {
      const success = await apiDeleteAthlete(slug);
      
      if (success) {
        setAthletes(athletes.filter(athlete => athlete.slug !== slug));
      } else {
        alert('Failed to delete athlete. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting athlete:', error);
      alert('Failed to delete athlete. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="mx-auto lg:mx-0">
              <img src="/Final_2_Transparent_png_180x-_1_.png" alt="Optimal Sports" className="h-7" />
            </a>
            <div className="flex items-center gap-4 ml-auto">
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                + Add Athlete
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-gray-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Athletes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{athletes.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-gray-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Athletes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{athletes.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-gray-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Schools</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(athletes.map(a => a.school)).size}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-gray-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Positions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(athletes.map(a => a.position)).size}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search athletes by name, school, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredAthletes.length} of {athletes.length} athletes
            </div>
          </div>
        </div>

        {/* Athletes Table */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Athletes Management</h3>
            <button
              onClick={loadAthletes}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium"
            >
              Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Athlete</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">School</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                {filteredAthletes.map((athlete) => (
                  <tr key={athlete.slug} className="hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer" onClick={() => window.open(`/athletes/${athlete.slug}`, '_blank')}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-neutral-600">
                          <img src={athlete.image} alt={athlete.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{athlete.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">#{athlete.number || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                        {athlete.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{athlete.school}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAthlete(athlete);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAthlete(athlete.slug);
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Products Management */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mt-10 bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Products</h3>
          <div className="flex gap-2">
            <button
              onClick={loadProducts}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium"
            >
              Refresh
            </button>
            <button
              onClick={() => setEditingProduct({ id: '', name: '', price: 0, imageUrl: '', athleteSlug: '', athleteName: '', school: '', active: true, createdAt: Date.now(), updatedAt: Date.now() })}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
            >
              + Add Product
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Athlete</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">School</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{p.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{p.athleteName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{p.school}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${p.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{p.active ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >Edit</button>
                      <button
                        onClick={async () => { if (confirm('Delete product?')) { const ok = await apiDeleteProduct(p.id); if (ok) setProducts(products.filter(x => x.id !== p.id)); } }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Executives Management (below products) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-10 bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Executive Roster</h3>
            <button onClick={() => setExecutives([...executives, { id: Date.now().toString(), name: '', title: '', image: '', bio: '' }])} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">+ Add Executive</button>
          </div>
          <div className="p-6 space-y-4">
            {executives.length === 0 && (
              <div className="text-sm text-gray-500">No executives yet. Click “Add Executive”.</div>
            )}
            {executives.map((ex, idx) => (
              <div key={ex.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-start">
                <input className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white" placeholder="Name" value={ex.name} onChange={(e) => { const next=[...executives]; next[idx].name=e.target.value; setExecutives(next); }} />
                <input className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white" placeholder="Title" value={ex.title} onChange={(e) => { const next=[...executives]; next[idx].title=e.target.value; setExecutives(next); }} />
                <input className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white" placeholder="Image URL (public path)" value={ex.image} onChange={(e) => { const next=[...executives]; next[idx].image=e.target.value; setExecutives(next); }} />
                <input className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white md:col-span-2" placeholder="Short bio (optional)" value={ex.bio || ''} onChange={(e) => { const next=[...executives]; next[idx].bio=e.target.value; setExecutives(next); }} />
                <div className="md:col-span-5 flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-neutral-600 text-sm" onClick={() => setExecutives(executives.filter((_,i)=>i!==idx))} type="button">Remove</button>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200 dark:border-neutral-700">
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium" onClick={async()=>{
                console.log('Saving executives:', executives.length);
                const res = await fetch('/api/executives',{method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(executives)});
                if (res.ok) {
                  alert('Executives saved successfully!');
                } else {
                  alert('Failed to save executives. Please try again.');
                }
              }}>Save Executives</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Athlete Modal */}
      <AthleteModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddAthlete}
        mode="add"
      />

      {/* Edit Athlete Modal */}
      <AthleteModal
        isOpen={!!editingAthlete}
        onClose={() => setEditingAthlete(null)}
        athlete={editingAthlete || undefined}
        onSave={handleSaveEdit}
        mode="edit"
      />

      {/* Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingProduct.id ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const { id, ...rest } = editingProduct;
                if (id) {
                  const updated = await apiUpdateProduct(id, { ...rest });
                  if (updated) {
                    setProducts(products.map(p => p.id === id ? updated : p));
                    alert('Product updated successfully!');
                  } else {
                    alert('Failed to update product. Please try again.');
                  }
                } else {
                  console.log('Creating product:', rest.name, 'with images:', rest.images?.length || 0);
                  
                  // Use direct fetch like executives section
                  const response = await fetch('/api/products', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(rest),
                  });
                  
                  if (response.ok) {
                    const created = await response.json();
                    setProducts([created, ...products]);
                    alert('Product created successfully!');
                  } else {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    alert('Failed to create product. Please try again.');
                  }
                }
                setEditingProduct(null);
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white" placeholder="Product name" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} required />
                <input className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white" type="number" step="0.01" placeholder="Price" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })} required />
                <input className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white md:col-span-2" placeholder="Main Image URL (optional)" value={editingProduct.imageUrl || ''} onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })} />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Additional Images (one per line)</label>
                  <textarea 
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white" 
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                    rows={4}
                    value={(editingProduct.images || []).join('\n')} 
                    onChange={(e) => setEditingProduct({ ...editingProduct, images: e.target.value.split('\n').map(url => url.trim()).filter(Boolean) })} 
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter one image URL per line. These will be used as a gallery.</p>
                </div>
                <select className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white" value={editingProduct.athleteSlug} onChange={(e) => {
                  const slug = e.target.value; const name = slug ? (athletes.find(a => a.slug === slug)?.name || '') : '';
                  setEditingProduct({ ...editingProduct, athleteSlug: slug, athleteName: name });
                }}>
                  <option value="">Unassigned (general)</option>
                  {athletes.map(a => (<option key={a.slug} value={a.slug}>{a.name}</option>))}
                </select>
                <input className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white" placeholder="School" value={editingProduct.school} onChange={(e) => setEditingProduct({ ...editingProduct, school: e.target.value })} />
                <input className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white" placeholder="External purchase URL (optional)" value={editingProduct.externalUrl || ''} onChange={(e) => setEditingProduct({ ...editingProduct, externalUrl: e.target.value })} />
                <label className="inline-flex items-center gap-2 text-sm md:col-span-2">
                  <input type="checkbox" checked={editingProduct.active} onChange={(e) => setEditingProduct({ ...editingProduct, active: e.target.checked })} /> Active
                </label>
                {/* Categories */}
                <input className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white md:col-span-2" placeholder="Categories (comma-separated)" value={(editingProduct.categories || []).join(', ')} onChange={(e) => setEditingProduct({ ...editingProduct, categories: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                {/* Sizes */}
                <input className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white" placeholder="Sizes (e.g., S,M,L,XL)" value={(editingProduct.sizes || []).join(',')} onChange={(e) => setEditingProduct({ ...editingProduct, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                
                {/* Printful Variant IDs by Size */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Printful Variant IDs by Size</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Enter the Printful variant ID for each size. Get these from your Printful dashboard.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['S','M','L','XL','2XL','3XL'].map((size) => (
                      <div key={size} className="flex items-center gap-2">
                        <span className="w-8 text-sm font-semibold">{size}</span>
                        <input 
                          type="text" 
                          className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white" 
                          placeholder={`Variant ID for ${size}`}
                          value={(editingProduct.variantIdsBySize?.[size] || '')} 
                          onChange={(e) => {
                            setEditingProduct({ 
                              ...editingProduct, 
                              variantIdsBySize: { 
                                ...(editingProduct.variantIdsBySize || {}), 
                                [size]: e.target.value 
                              } 
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter the Printful variant ID for each size. Get these from your Printful dashboard.
                  </p>
                </div>
                {/* Inventory by size */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Inventory by size</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(editingProduct.sizes || ['S','M','L','XL']).map((size) => (
                      <div key={size} className="flex items-center gap-2">
                        <span className="w-8 text-sm font-semibold">{size}</span>
                        <input type="number" min={0} className="w-20 px-2 py-1 rounded border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white" value={(editingProduct.inventoryBySize?.[size] ?? 0)} onChange={(e) => {
                          const qty = parseInt(e.target.value) || 0;
                          setEditingProduct({ ...editingProduct, inventoryBySize: { ...(editingProduct.inventoryBySize || {}), [size]: qty } });
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium">Save</button>
                <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-neutral-600 dark:hover:bg-neutral-500 text-gray-700 dark:text-white rounded-lg font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Admin Footer */}
      <footer className="mt-10 py-6 text-center text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center justify-center gap-4">
          <span>© 2025 Optimal Sports</span>
          <a href="https://www.linkedin.com/company/optimal-sports-management/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600">LinkedIn</a>
          <a href="https://instagram.com/optimalsportsmgmt" target="_blank" rel="noopener noreferrer" className="hover:text-red-600">Instagram</a>
        </div>
      </footer>
    </main>
  );
}
