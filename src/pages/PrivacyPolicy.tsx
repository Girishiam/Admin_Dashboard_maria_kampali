import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BoldIcon, 
  ItalicIcon, 
  Bars3Icon, 
  PencilIcon
} from '@heroicons/react/24/outline';

function PrivacyPolicy() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleSave = () => {
    setIsEditing(false);
    const content = editorRef.current?.innerHTML;
    console.log('Saved content:', content);
    alert('Privacy Policy updated successfully!');
  };

  const initialContent = `
    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Introduction</h2>
    <p style="margin-bottom: 1.5rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website.</p>

    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Information We Collect</h2>
    <p style="margin-bottom: 0.75rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">We may collect the following types of information:</p>
    <ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem;">
      <li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;"><strong>Personal Information:</strong> Name, email address, phone number when voluntarily provided</li>
      <li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;"><strong>Usage Data:</strong> IP address, browser type, pages visited, and time spent on our site</li>
      <li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;"><strong>Cookies:</strong> Small data files stored on your device to enhance user experience</li>
    </ul>

    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">How We Use Your Information</h2>
    <p style="margin-bottom: 0.75rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">Your information helps us to:</p>
    <ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem;">
      <li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;">Provide and maintain our services</li>
      <li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;">Improve and personalize user experience</li>
      <li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;">Communicate with you about updates and offers</li>
      <li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;">Analyze usage patterns to enhance our website</li>
      <li style="margin-bottom: 0.5rem; color: #1f2937; font-size: 0.875rem;">Ensure security and prevent fraud</li>
    </ul>

    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Data Security</h2>
    <p style="margin-bottom: 1.5rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure.</p>

    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Third-Party Services</h2>
    <p style="margin-bottom: 1.5rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">We may use third-party services for analytics and functionality. These services have their own privacy policies, and we encourage you to review them.</p>

    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Cookies Policy</h2>
    <p style="margin-bottom: 1.5rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">We use cookies to enhance your browsing experience. You can control cookie settings through your browser preferences. Disabling cookies may affect website functionality.</p>

    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937;">Changes to This Policy</h2>
    <p style="margin-bottom: 1.5rem; color: #1f2937; line-height: 1.6; font-size: 0.875rem;">We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated revision date.</p>
  `;

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
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-600">22 December, 2025</p>
        </div>

        {/* Formatting Toolbar (shown only in edit mode) */}
        {isEditing && (
          <div className="mb-4 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
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
                  className="px-4 py-2 bg-[#005440] text-white rounded-lg font-semibold text-sm hover:bg-[#004435] transition-all"
                >
                  Save Changes
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
          dangerouslySetInnerHTML={{ __html: initialContent }}
          className={`outline-none ${isEditing ? 'border-2 border-dashed border-gray-400 bg-white p-6 rounded-lg' : ''}`}
          style={{ minHeight: '600px' }}
        />
      </div>
    </div>
  );
}

export default PrivacyPolicy;
