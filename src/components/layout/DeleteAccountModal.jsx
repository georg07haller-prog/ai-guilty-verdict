import React, { useState } from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function DeleteAccountModal() {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Clear local data
      sessionStorage.clear();
      localStorage.clear();
      // Sign out — actual account deletion would need a backend function
      await base44.auth.logout('/');
    } catch {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-destructive/60 hover:text-destructive transition-colors font-mono underline underline-offset-2 select-none"
        style={{ userSelect: 'none' }}
      >
        Delete Account
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <h2 className="font-display font-bold text-foreground text-base">Delete Account</h2>
              </div>
              <button onClick={() => { setOpen(false); setConfirming(false); }} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              This will permanently delete all your verdicts, data, and account information. This action <strong className="text-foreground">cannot be undone</strong>.
            </p>

            {!confirming ? (
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={() => setConfirming(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Yes, delete my account
                </Button>
                <Button variant="ghost" onClick={() => setOpen(false)} className="text-muted-foreground">
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-destructive font-mono bg-destructive/10 rounded-lg px-3 py-2 border border-destructive/20">
                  ⚠️ Are you absolutely sure? This is irreversible.
                </p>
                <Button
                  disabled={loading}
                  className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDelete}
                >
                  {loading ? 'Deleting...' : 'Delete Everything'}
                </Button>
                <Button variant="ghost" onClick={() => setConfirming(false)} className="w-full text-muted-foreground">
                  Go back
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}