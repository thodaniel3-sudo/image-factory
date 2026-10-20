import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { checkHealth, api } from './api';

interface ImageData {
  id: string;
  storage_path: string;
  url: string;
  provider: string;
  review_status: string;
  quality_notes?: string;
  created_at: string;
}

interface PromptData {
  id: string;
  prompt_text: string;
  category: string;
  status: string;
  created_at: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'prompts' | 'gallery'>('dashboard');
  const [backendStatus, setBackendStatus] = useState('Checking...');

  useEffect(() => {
    checkHealth()
      .then((data) => setBackendStatus(data.status === 'ok' ? 'Connected' : 'Error'))
      .catch(() => setBackendStatus('Disconnected'));
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold text-white tracking-wide"><span className="text-blue-500">AI</span> Factory</span>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          <button onClick={() => setCurrentPage('dashboard')} className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${currentPage === 'dashboard' ? 'bg-slate-800 text-white border-r-4 border-blue-500' : 'hover:bg-slate-800 hover:text-white'}`}>
            <span className="mr-3 text-lg">📊</span> Dashboard
          </button>
          <button onClick={() => setCurrentPage('prompts')} className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${currentPage === 'prompts' ? 'bg-slate-800 text-white border-r-4 border-blue-500' : 'hover:bg-slate-800 hover:text-white'}`}>
            <span className="mr-3 text-lg">📝</span> Prompts
          </button>
          <button onClick={() => setCurrentPage('gallery')} className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${currentPage === 'gallery' ? 'bg-slate-800 text-white border-r-4 border-blue-500' : 'hover:bg-slate-800 hover:text-white'}`}>
            <span className="mr-3 text-lg">🖼️</span> Gallery
          </button>
          <button className="w-full flex items-center px-6 py-3 text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors opacity-50 cursor-not-allowed">
            <span className="mr-3 text-lg">⚙️</span> Settings
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">D</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Daniel</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-0">
          <h2 className="text-lg font-semibold text-slate-800 capitalize">{currentPage === 'dashboard' ? 'Overview' : currentPage}</h2>
          <div className="flex items-center space-x-4">
             <div className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> API {backendStatus}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'prompts' && <Prompts />}
          {currentPage === 'gallery' && <Gallery />}
        </div>
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between"><h3 className="text-sm font-medium text-slate-500">Total Images</h3><span className="p-2 bg-blue-50 text-blue-600 rounded-lg">🖼️</span></div>
          <p className="text-3xl font-bold text-slate-800 mt-4">1</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between"><h3 className="text-sm font-medium text-slate-500">Pending Jobs</h3><span className="p-2 bg-amber-50 text-amber-600 rounded-lg">⏳</span></div>
          <p className="text-3xl font-bold text-slate-800 mt-4">0</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between"><h3 className="text-sm font-medium text-slate-500">Estimated Cost</h3><span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">💵</span></div>
          <p className="text-3xl font-bold text-slate-800 mt-4">$0.00</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="text-4xl mb-4">🚀</div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome to your Factory</h2>
        <p className="text-slate-500 max-w-md mx-auto">Your environment is set up and connected to Supabase. Navigate to the Gallery to view your generated assets.</p>
      </div>
    </div>
  );
}

function Prompts() {
  const [prompts, setPrompts] = useState<PromptData[]>([]);
  const [loading, setLoading] = useState(true);
  const [promptText, setPromptText] = useState('');
  const [category, setCategory] = useState('Product');

  const fetchPrompts = () => {
    setLoading(true);
    api.get('/api/prompts').then((res) => { setPrompts(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchPrompts(); }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!promptText) return;
    api.post('/api/prompts', { prompt_text: promptText, category, width: 512, height: 512 })
      .then(() => { setPromptText(''); fetchPrompts(); });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Prompt</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prompt Description</label>
            <textarea value={promptText} onChange={(e) => setPromptText(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Describe the image you want to generate..." required />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Product">Product</option><option value="Fitness">Fitness</option><option value="Design">Design</option><option value="Technology">Technology</option>
              </select>
            </div>
            <div className="flex items-end"><button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">Send to Queue</button></div>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200"><h3 className="text-lg font-semibold text-slate-800">Generation Queue</h3></div>
        {loading ? <div className="p-8 text-center text-slate-500">Loading...</div> : prompts.length === 0 ? <div className="p-8 text-center text-slate-500">No prompts in the queue.</div> : (
          <ul className="divide-y divide-slate-200">
            {prompts.map((prompt) => (
              <li key={prompt.id} className="p-6 hover:bg-slate-50 transition-colors flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-slate-800 mb-1">{prompt.prompt_text}</p>
                  <p className="text-xs text-slate-500">Category: {prompt.category} | Added: {new Date(prompt.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${prompt.status === 'pending' ? 'bg-amber-100 text-amber-700' : prompt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>{prompt.status.toUpperCase()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Gallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  
  // Review & Marketplace state
  const [activeTab, setActiveTab] = useState<'review' | 'marketplace'>('review');
  const [reviewStatus, setReviewStatus] = useState('approved');
  const [qualityNotes, setQualityNotes] = useState('');
  
  // Listing state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [marketplace, setMarketplace] = useState('Adobe Stock');
  const [aiDisclosure, setAiDisclosure] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const fetchImages = () => {
    setLoading(true);
    api.get('/api/images').then((res) => { setImages(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchImages(); }, []);

  const openModal = async (img: ImageData) => {
    setSelectedImage(img);
    setReviewStatus(img.review_status);
    setQualityNotes(img.quality_notes || '');
    setActiveTab('review');

    // Reset listing state
    setTitle(''); setDescription(''); setKeywords('');
    
    // Try to fetch existing listing
    try {
      const res = await api.get(`/api/listings/${img.id}`);
      if (res.data.data) {
        setTitle(res.data.data.listing_title || '');
        setDescription(res.data.data.description || '');
        setKeywords(res.data.data.keywords || '');
        setMarketplace(res.data.data.marketplace_name || 'Adobe Stock');
        setAiDisclosure(res.data.data.ai_disclosure_completed || false);
      }
    } catch (e) {
      console.log("No existing listing");
    }
  };

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;
    setSubmitting(true);
    api.post('/api/images/review', { image_id: selectedImage.id, review_status: reviewStatus, quality_notes: qualityNotes })
      .then(() => { setSubmitting(false); setSelectedImage(null); fetchImages(); });
  };

  const handleListingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;
    setSubmitting(true);
    api.post('/api/listings', {
      image_id: selectedImage.id,
      marketplace_name: marketplace,
      listing_title: title,
      description: description,
      keywords: keywords,
      category: selectedImage.provider,
      ai_disclosure_completed: aiDisclosure
    }).then(() => { setSubmitting(false); alert('Marketplace metadata saved!'); }).catch(() => setSubmitting(false));
  };

  const downloadCSV = () => {
    window.open('http://127.0.0.1:8000/api/export/csv', '_blank');
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6">
      
      {/* Top Bar with Export Button */}
      <div className="flex justify-end">
        <button onClick={downloadCSV} className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-lg shadow-sm text-sm transition-colors">
          📥 Export Prepared Listings (CSV)
        </button>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex overflow-hidden h-[85vh]">
            
            <div className="w-1/2 bg-slate-900 flex items-center justify-center p-4">
              <img src={selectedImage.url} alt="Review" className="max-w-full max-h-full object-contain rounded" />
            </div>

            <div className="w-1/2 flex flex-col h-full bg-white">
              
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-200">
                <div className="flex space-x-4">
                  <button onClick={() => setActiveTab('review')} className={`text-lg font-semibold pb-2 border-b-2 transition-colors ${activeTab === 'review' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Quality Review</button>
                  <button onClick={() => setActiveTab('marketplace')} className={`text-lg font-semibold pb-2 border-b-2 transition-colors ${activeTab === 'marketplace' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Marketplace Details</button>
                </div>
                <button onClick={() => setSelectedImage(null)} className="text-slate-400 hover:text-slate-700 text-2xl leading-none">&times;</button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6">
                
                {/* Review Tab */}
                {activeTab === 'review' && (
                  <form onSubmit={handleReviewSubmit} className="flex flex-col h-full">
                    <div className="mb-6 flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Quality Notes (Optional)</label>
                      <textarea value={qualityNotes} onChange={(e) => setQualityNotes(e.target.value)} className="w-full h-32 border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Note any defects, anatomy issues, or licensing concerns..." />
                    </div>
                    <div className="space-y-3 mb-6">
                      <label className="block text-sm font-medium text-slate-700">Decision</label>
                      <div className="flex space-x-2">
                        <button type="button" onClick={() => setReviewStatus('approved')} className={`flex-1 py-3 rounded-lg font-medium text-sm border transition-colors ${reviewStatus === 'approved' ? 'bg-green-100 border-green-500 text-green-700 shadow-sm' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>✅ Approve</button>
                        <button type="button" onClick={() => setReviewStatus('needs_revision')} className={`flex-1 py-3 rounded-lg font-medium text-sm border transition-colors ${reviewStatus === 'needs_revision' ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-sm' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>⚠️ Revise</button>
                        <button type="button" onClick={() => setReviewStatus('rejected')} className={`flex-1 py-3 rounded-lg font-medium text-sm border transition-colors ${reviewStatus === 'rejected' ? 'bg-red-100 border-red-500 text-red-700 shadow-sm' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>❌ Reject</button>
                      </div>
                    </div>
                    <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 mt-auto">
                      {submitting ? 'Saving...' : 'Save Review Decision'}
                    </button>
                  </form>
                )}

                {/* Marketplace Tab */}
                {activeTab === 'marketplace' && (
                  <form onSubmit={handleListingSubmit} className="space-y-4">
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Marketplace</label>
                        <select value={marketplace} onChange={(e) => setMarketplace(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-blue-500">
                          <option>Adobe Stock</option>
                          <option>Dreamstime</option>
                          <option>Freepik</option>
                        </select>
                      </div>
                      <div className="flex-1 flex items-end pb-2">
                        <label className="flex items-center cursor-pointer">
                          <input type="checkbox" checked={aiDisclosure} onChange={(e) => setAiDisclosure(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                          <span className="ml-2 text-sm text-slate-700">AI Disclosure Completed</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-blue-500" placeholder="e.g. Futuristic Cyberpunk Neon City" required />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-blue-500 h-20 resize-none" placeholder="Detailed description for the marketplace..." required />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Keywords (comma separated)</label>
                      <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-blue-500" placeholder="cyberpunk, neon, city, futuristic..." required />
                    </div>

                    <button type="submit" disabled={submitting} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50">
                      {submitting ? 'Saving...' : 'Save Marketplace Metadata'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {images.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center"><p className="text-slate-500">No images found. Start the worker to generate some!</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} onClick={() => openModal(img)} className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <div className="relative aspect-square bg-slate-100 overflow-hidden">
                {img.url ? <img src={img.url} alt="Generated" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex items-center justify-center h-full text-slate-400">Image unavailable</div>}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">{img.provider.toUpperCase()}</div>
              </div>
              <div className="p-4 border-t border-slate-100 flex justify-between items-center">
                <div>
                  <p className={`text-xs font-bold mb-1 ${img.review_status === 'approved' ? 'text-green-600' : img.review_status === 'rejected' ? 'text-red-600' : img.review_status === 'needs_revision' ? 'text-amber-600' : 'text-blue-600'}`}>{img.review_status.replace('_', ' ').toUpperCase()}</p>
                  <p className="text-xs text-slate-500 truncate w-32" title={img.storage_path}>{img.storage_path.split('/').pop()}</p>
                </div>
                <span className="text-slate-400 group-hover:text-blue-500 transition-colors">➔</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;