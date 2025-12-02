import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BoldIcon, 
  ItalicIcon, 
  Bars3Icon, 
  PencilIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { getTermsConditions, updateTermsConditions, TermsConditionsData } from '../services/api_call';

function TermsConditions() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [termsData, setTermsData] = useState<TermsConditionsData | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await getTermsConditions(1);
      if (response.success) {
        setTermsData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch terms & conditions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
    
    setSaving(true);
    const content = editorRef.current.innerHTML;
    
    // Determine version and effective date
    let version = '2.0';
    const effectiveDate = new Date().toISOString().split('T')[0];

    if (termsData?.version) {
      const parts = termsData.version.split('.');
      if (parts.length >= 1) {
        const major = parseInt(parts[0]);
        // Increment major version as requested (+1)
        version = `${major + 1}.0`;
      }
    }
    
    const payload = {
      content,
      version,
      effective_date: effectiveDate,
      title: 'Terms and Conditions',
      is_active: true
    };

    try {
      const response = await updateTermsConditions(1, payload);

      if (response.success) {
        setTermsData(response.data);
        setIsEditing(false);
        // Optional: Show success message
      }
    } catch (error) {
      console.error('Failed to save terms & conditions:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E6EEEC' }}>
        <ArrowPathIcon className="w-8 h-8 animate-spin text-[#005440]" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative" style={{ backgroundColor: '#E6EEEC' }}>
      {/* Edit Button - Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:right-8 lg:right-12 z-10">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-white text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm border border-gray-200"
        >
          <PencilIcon className="w-4 h-4" />
          <span>{isEditing ? 'Done Editing' : 'Edit'}</span>
        </button>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          {/* Clickable Logo */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 mb-4 mx-auto hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-[#005440] rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-gray-900">ALFABETS24</span>
          </button>
          
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-600">
            Updated At: {termsData?.updated_at ? new Date(termsData.updated_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Formatting Toolbar (shown only in edit mode) */}
        {isEditing && (
          <div className="mb-4 p-3 bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4 z-20">
            <div className="flex gap-2 flex-wrap items-center">
              <button
                onClick={() => applyFormatting('bold')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Bold"
              >
                <BoldIcon className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => applyFormatting('italic')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Italic"
              >
                <ItalicIcon className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => applyFormatting('underline')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Underline"
              >
                <span className="text-gray-700 font-bold underline">U</span>
              </button>
              <button
                onClick={() => applyFormatting('insertUnorderedList')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Bullet List"
              >
                <Bars3Icon className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => applyFormatting('insertOrderedList')}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Numbered List"
              >
                <span className="text-gray-700 font-bold">1.</span>
              </button>
              
              <div className="ml-auto">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-[#005440] text-white rounded-lg font-semibold text-sm hover:bg-[#004435] transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div
          ref={editorRef}
          contentEditable={isEditing}
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: termsData?.content || '<p>No content available.</p>' }}
          className={`outline-none ${isEditing ? 'border-2 border-dashed border-gray-400 bg-white p-6 rounded-lg min-h-[600px]' : ''}`}
          style={{ minHeight: isEditing ? '600px' : 'auto' }}
        />
      </div>
    </div>
  );
}

export default TermsConditions;
