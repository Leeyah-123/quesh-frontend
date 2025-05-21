'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  Share,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface DocumentViewerProps {
  documentName: string;
  documentType: 'pdf' | 'docx' | 'url';
  documentId: string;
  onClose: () => void;
  highlightedPage?: number;
  highlightedText?: string;
}

// Custom dialog styles
const dialogStyles = {
  dialog: {
    position: 'fixed' as const,
    inset: 0,
    maxWidth: '90%',
    maxHeight: '90vh',
    margin: 'auto',
    padding: 0,
    backgroundColor: 'var(--background)',
    border: '1px solid var(--slate-800)',
    borderRadius: '0.5rem',
    boxShadow:
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    height: 'fit-content',
    overflow: 'hidden',
    zIndex: 50,
  },
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 49,
  },
};

// Handle escape key
const useEscapeKey = (onClose: () => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
};

export function DocumentViewer({
  documentName,
  documentType,
  documentId,
  onClose,
  highlightedPage,
  highlightedText,
}: DocumentViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container) {
      const div = document.createElement('div');
      div.className = 'document-viewer-portal';
      document.body.appendChild(div);
      setContainer(div);
    }

    return () => {
      if (container) {
        document.body.removeChild(container);
      }
    };
  }, [container]);

  useEscapeKey(onClose);

  const [currentPage, setCurrentPage] = useState(highlightedPage ?? 1);
  const totalPages = 10; // Mock value
  const isMobile = useMobile();

  useEffect(() => {
    if (highlightedPage) {
      setCurrentPage(highlightedPage);
    }
  }, [highlightedPage]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!container) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center min-h-screen"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-4xl h-full md:h-[90%] rounded-lg border border-slate-800 m-auto bg-background"
      >
        <div className="flex flex-col h-full">
          {/* Document header */}
          <div className="border-b border-slate-800 p-3 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="mr-2"
              >
                <X className="h-4 w-4" />
              </Button>
              <h3 className="font-medium truncate">{documentName}</h3>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" title="Download">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" title="Share">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search bar */}
          <div className="border-b border-slate-800 p-3 bg-slate-900/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search in document..."
                className="pl-9 bg-slate-800/50 border-slate-700"
              />
            </div>
          </div>

          {/* Document content */}
          <div className="flex-1 overflow-auto p-6 bg-slate-950/50">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Mock document content */}
              <div className="p-8 text-black min-h-[800px] overflow-auto">
                <h1 className="text-2xl font-bold mb-6">
                  Sample Document Content
                </h1>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <p
                        key={index}
                        className={`text-sm text-gray-700 ${
                          highlightedText &&
                          highlightedPage !== undefined &&
                          index === highlightedPage - 1
                            ? 'text-purple-500 font-medium'
                            : ''
                        }`}
                      >
                        {highlightedText &&
                        highlightedPage !== undefined &&
                        index === highlightedPage - 1
                          ? highlightedText
                          : `This is section ${index} content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim.`}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Pagination controls */}
          <div className="border-t border-slate-800 p-3 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
              className="border-slate-700"
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="border-slate-700"
              title="Next Page"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>,
    container
  );
}
