import { useState, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Scan, X } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'

interface BarcodeScannerProps {
  onScanComplete: (code: string) => void
  placeholder?: string
  title?: string
  description?: string
}

export default function BarcodeScanner({ 
  onScanComplete, 
  placeholder = "Scan barcode atau ketik manual...",
  title = "Scan Barcode",
  description = "Arahkan scanner ke barcode atau ketik kode transaksi"
}: BarcodeScannerProps) {
  const [open, setOpen] = useState(false)
  const [scannedCode, setScannedCode] = useState('')
  const [error, setError] = useState('')

  // Handle barcode scanner input (scanners act like keyboards)
  useEffect(() => {
    if (!open) return

    let buffer = ''
    let timeout: NodeJS.Timeout

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input field
      if (e.target instanceof HTMLInputElement) return

      clearTimeout(timeout)
      
      if (e.key === 'Enter') {
        if (buffer.length > 3) {
          setScannedCode(buffer)
          handleSubmit(buffer)
          buffer = ''
        }
      } else if (e.key.length === 1) {
        // Only capture single character keys
        buffer += e.key
        timeout = setTimeout(() => {
          buffer = ''
        }, 100)
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => {
      window.removeEventListener('keypress', handleKeyPress)
      clearTimeout(timeout)
    }
  }, [open])

  const handleSubmit = (code?: string) => {
    const codeToSubmit = code || scannedCode
    if (!codeToSubmit) {
      setError('Kode barcode tidak boleh kosong')
      return
    }

    const cleanCode = codeToSubmit.trim().toUpperCase()
    
    if (cleanCode.length < 4) {
      setError('Kode barcode tidak valid')
      return
    }

    setError('')
    onScanComplete(cleanCode)
    setOpen(false)
    setScannedCode('')
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit()
  }

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Scan className="h-4 w-4" />
        Scan Barcode
      </Button>

      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          setScannedCode('')
          setError('')
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="text"
                  value={scannedCode}
                  onChange={(e) => {
                    setScannedCode(e.target.value.toUpperCase())
                    setError('')
                  }}
                  placeholder={placeholder}
                  className="pr-10"
                  autoFocus
                />
                {scannedCode && (
                  <button
                    type="button"
                    onClick={() => {
                      setScannedCode('')
                      setError('')
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Scan className="h-3 w-3" />
                <span>Scanner barcode aktif - scan atau ketik manual</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">
                Proses
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
