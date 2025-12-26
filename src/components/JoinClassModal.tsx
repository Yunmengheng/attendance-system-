'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface JoinClassModalProps {
  onClose: () => void;
  onJoin: (code: string) => void;
}

export function JoinClassModal({ onClose, onJoin }: JoinClassModalProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onJoin(code.toUpperCase());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white dark:bg-card rounded-2xl shadow-xl w-full max-w-md">
        <div className="border-b border-border px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl">Join Class</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="classCode" className="block text-sm mb-2">
              Class Code
            </label>
            <input
              id="classCode"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g., CS101A"
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-center text-xl tracking-wider"
              maxLength={10}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Enter the class code provided by your teacher
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Join Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}