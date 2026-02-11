import { useState, useRef, useCallback, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IconCamera, IconLoader2, IconX, IconCheck, IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VehicleScannerProps {
    onScanComplete: (data: {
        plat_nomor: string;
        jenis_kendaraan?: string;
        exists?: boolean;
        existingData?: any;
        auto_detected?: boolean; // 🔥 Tambahan buat deteksi otomatis
    }) => void;
}

export default function VehicleScanner({ onScanComplete }: VehicleScannerProps) {
    const [open, setOpen] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; text: string } | null>(null);
    const [progress, setProgress] = useState<string>('');
    const [showGuide, setShowGuide] = useState(true); // 🔥 Guide awal
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const handleOpenCamera = async () => {
        setOpen(true);
        setScanning(true);
        setCapturedImage(null);
        setMessage(null);
        setProgress('');
        setShowGuide(true);
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'environment',
                    // 🔥 RESOLUSI LEBIH TINGGI untuk deteksi kendaraan
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            }
        } catch (error) {
            console.error('Camera error:', error);
            setMessage({
                type: 'error',
                text: 'Gagal mengakses kamera. Pastikan izin kamera diberikan.'
            });
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    useEffect(() => {
        if (scanning && !capturedImage) {
            startCamera();
            
            // 🔥 Auto-hide guide setelah 5 detik
            const timer = setTimeout(() => {
                setShowGuide(false);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
        return () => {
            stopCamera();
        };
    }, [scanning, capturedImage]);

    const handleCapture = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0);
            
            // 🔥 VALIDASI FOTO SEBELUM DIKIRIM
            const width = canvas.width;
            const height = canvas.height;
            
            // Check resolusi minimal
            if (width < 800 || height < 600) {
                setMessage({
                    type: 'warning',
                    text: '⚠️ Foto terlalu kecil! Minimal 800x600 pixel. Coba ambil ulang dengan jarak lebih dekat.'
                });
                return;
            }
            
            // Check aspect ratio (jangan terlalu sempit)
            const aspectRatio = width / height;
            if (aspectRatio < 0.5 || aspectRatio > 3) {
                setMessage({
                    type: 'warning',
                    text: '⚠️ Foto terlalu sempit atau terlalu lebar! Ambil foto dengan posisi landscape normal.'
                });
                return;
            }
            
            // 🔥 KUALITAS TINGGI (0.95) untuk deteksi kendaraan
            canvas.toBlob((blob) => {
                if (blob) {
                    // Check file size
                    const sizeInKB = blob.size / 1024;
                    
                    if (sizeInKB < 100) {
                        setMessage({
                            type: 'warning',
                            text: '⚠️ Kualitas foto terlalu rendah! Pastikan pencahayaan cukup dan fokus jelas.'
                        });
                        return;
                    }
                    
                    const imageSrc = URL.createObjectURL(blob);
                    setCapturedImage(imageSrc);
                    setScanning(false);
                    setShowGuide(false);
                    stopCamera();
                    processImage(blob);
                }
            }, 'image/jpeg', 0.95);
        }
    }, []);

    const processImage = async (imageBlob: Blob) => {
        setProcessing(true);
        setMessage(null);

        try {
            // STEP 1: Pre-scan dengan Tesseract.js (gratis, di client-side)
            setProgress('Melakukan pre-scan plat nomor...');
            const imageSrc = URL.createObjectURL(imageBlob);
            const preScannedPlate = await scanWithTesseract(imageSrc);

            // STEP 2: Siapkan FormData dengan blob langsung
            setProgress('Mengirim ke server untuk verifikasi...');
            const formData = new FormData();
            formData.append('photo', imageBlob, 'vehicle.jpg');
            
            if (preScannedPlate) {
                formData.append('pre_scanned_plate', preScannedPlate);
                setProgress(`Pre-scan: ${preScannedPlate} - Memeriksa database...`);
            } else {
                setProgress('Pre-scan gagal, menggunakan PlateRecognizer API...');
            }

            // STEP 3: Kirim ke backend untuk cek database & PlateRecognizer API
            const response = await fetch('/api/scan-plat', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            // Check if response is OK and is JSON
            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP Error ${response.status}`);
                } else {
                    throw new Error(`Server error (${response.status}): Endpoint mungkin tidak tersedia atau ada masalah autentikasi`);
                }
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server tidak mengembalikan JSON. Pastikan endpoint API tersedia dan benar.');
            }

            const result = await response.json();
            const { success, exists, data, message: responseMessage, source } = result;

            if (success) {
                if (exists) {
                    // Kendaraan sudah terdaftar
                    setMessage({
                        type: 'info',
                        text: `${responseMessage} (Dari: ${source === 'database' ? 'Database' : 'PlateRecognizer API'})`
                    });
                    onScanComplete({
                        plat_nomor: data.plat_nomor,
                        jenis_kendaraan: data.jenis_kendaraan,
                        exists: true,
                        existingData: data
                    });
                    
                    // Tutup dialog setelah 2 detik
                    setTimeout(() => {
                        setOpen(false);
                        resetScanner();
                    }, 2000);
                } else {
                    // 🔥 KENDARAAN BARU - CEK AUTO DETECTION
                    const autoDetected = data.auto_detected !== false && data.jenis_kendaraan;
                    
                    if (autoDetected) {
                        // ✅ Jenis kendaraan terdeteksi otomatis
                        setMessage({
                            type: 'success',
                            text: `${responseMessage} - Confidence: ${data.confidence}%`
                        });
                        onScanComplete({
                            plat_nomor: data.plat_nomor,
                            jenis_kendaraan: data.jenis_kendaraan,
                            exists: false,
                            auto_detected: true
                        });
                        
                        // Tutup dialog setelah 2 detik
                        setTimeout(() => {
                            setOpen(false);
                            resetScanner();
                        }, 2000);
                    } else {
                        // ⚠️ Jenis kendaraan TIDAK terdeteksi - butuh input manual
                        setMessage({
                            type: 'warning',
                            text: `Plat nomor terdeteksi: ${data.plat_nomor} (${data.confidence}%). Namun jenis kendaraan tidak terdeteksi. Silakan pilih jenis kendaraan secara manual.`
                        });
                        onScanComplete({
                            plat_nomor: data.plat_nomor,
                            jenis_kendaraan: null,
                            exists: false,
                            auto_detected: false
                        });
                        
                        // Tutup dialog setelah 3 detik
                        setTimeout(() => {
                            setOpen(false);
                            resetScanner();
                        }, 3000);
                    }
                }
            }
        } catch (error: any) {
            console.error('Scan error:', error);
            
            let errorMessage = 'Gagal memproses foto. Silakan coba lagi.';
            if (error.message) {
                errorMessage = error.message;
            }
            
            setMessage({
                type: 'error',
                text: errorMessage
            });
        } finally {
            setProcessing(false);
            setProgress('');
        }
    };

    const scanWithTesseract = async (imageSrc: string): Promise<string | null> => {
        try {
            const worker = await createWorker('eng');
            await worker.setParameters({
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ',
            });

            const { data: { text } } = await worker.recognize(imageSrc);
            await worker.terminate();

            const cleaned = text
                .replace(/[^A-Z0-9\s]/g, '')
                .replace(/\s+/g, '')
                .trim();

            if (cleaned.length >= 5) {
                return cleaned;
            }

            return null;
        } catch (error) {
            console.error('Tesseract error:', error);
            return null;
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        setScanning(true);
        setMessage(null);
        setProgress('');
        setShowGuide(true);
    };

    const resetScanner = () => {
        stopCamera();
        setCapturedImage(null);
        setScanning(false);
        setMessage(null);
        setProgress('');
        setShowGuide(false);
    };

    const handleClose = () => {
        setOpen(false);
        resetScanner();
    };

    return (
        <>
            <Button
                type="button"
                onClick={handleOpenCamera}
                variant="outline"
                className="w-full"
            >
                <IconCamera className="h-4 w-4 mr-2" />
                Scan Plat Nomor
            </Button>

            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="h-screen w-screen max-w-none p-0 gap-0 bg-black md:h-auto md:max-w-3xl md:rounded-lg md:p-6">
                    <DialogHeader className="p-4 md:p-0 absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent md:relative md:bg-transparent">
                        <DialogTitle className="text-white md:text-foreground">Scan Plat Nomor Kendaraan</DialogTitle>
                        <DialogDescription className="text-gray-200 md:text-muted-foreground">
                            {/* 🔥 INSTRUKSI YANG JELAS */}
                            Ambil foto SELURUH KENDARAAN dari jarak 2-3 meter, bukan close-up plat saja
                        </DialogDescription>
                    </DialogHeader>

                    <div className="h-full flex flex-col md:space-y-4">
                        {/* Preview Kamera atau Foto - Fullscreen di mobile */}
                        <div className="relative bg-black flex-1 md:flex-none md:rounded-lg overflow-hidden md:aspect-video">
                            {scanning && !capturedImage && (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover"
                                    />
                                    
                                    {/* 🔥 GUIDE YANG LEBIH LUAS - BUKAN FOKUS KE PLAT */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative w-11/12 max-w-2xl">
                                            {/* Frame untuk SELURUH KENDARAAN */}
                                            {/* <div className="border-4 border-blue-500 rounded-lg p-2 bg-transparent backdrop-blur-none">
                                                <div className="aspect-video border-2 border-dashed border-blue-400 rounded flex items-center justify-center">
                                                    <div className="text-center px-4">
                                                        <IconCamera className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                                                        <p className="text-blue-400 text-lg font-bold">
                                                            Posisikan SELURUH KENDARAAN di sini
                                                        </p>
                                                        <p className="text-blue-300 text-sm mt-2">
                                                            Plat nomor harus terlihat jelas
                                                        </p>
                                                    </div>
                                                </div>
                                            </div> */}
                                            {/* Corner indicators
                                            <div className="absolute -top-2 -left-2 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                                            <div className="absolute -top-2 -right-2 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                                            <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                                            <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div> */}
                                        </div>
                                    </div>

                                    {/* 🔥 GUIDE OVERLAY yang bisa di-hide */}
                                    {showGuide && (
                                        <div className="absolute top-20 left-0 right-0 mx-4 z-30">
                                            <Alert className="bg-blue-900/90 border-blue-500 backdrop-blur-md">
                                                <IconInfoCircle className="h-5 w-5 text-blue-300" />
                                                <AlertDescription className="text-white font-medium">
                                                    <p className="font-bold mb-2">📸 Tips Foto yang Baik:</p>
                                                    <ul className="space-y-1 text-sm">
                                                        <li>✅ Jarak 2-3 meter dari kendaraan</li>
                                                        <li>✅ Ambil foto SELURUH body kendaraan</li>
                                                        <li>✅ Plat nomor harus terlihat jelas</li>
                                                        <li>❌ JANGAN close-up ke plat saja</li>
                                                    </ul>
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className="mt-2 text-blue-200 hover:text-white"
                                                        onClick={() => setShowGuide(false)}
                                                    >
                                                        Mengerti, Sembunyikan
                                                    </Button>
                                                </AlertDescription>
                                            </Alert>
                                        </div>
                                    )}
                                </>
                            )}

                            {capturedImage && (
                                <img
                                    src={capturedImage}
                                    alt="Captured"
                                    className="w-full h-full object-contain" // 🔥 object-contain biar keliatan semua
                                />
                            )}

                            {!scanning && !capturedImage && (
                                <div className="flex items-center justify-center h-full text-white">
                                    <IconCamera className="h-16 w-16 opacity-50" />
                                </div>
                            )}
                        </div>

                        {/* Progress & Result Message - Fixed Bottom di Mobile */}
                        <div className="absolute bottom-20 left-0 right-0 px-4 space-y-2 z-10 md:relative md:bottom-auto md:px-0">
                            {progress && (
                                <Alert className="bg-black/80 border-white/20 backdrop-blur-md md:bg-background md:border-border">
                                    <IconLoader2 className="h-4 w-4 animate-spin text-white md:text-foreground" />
                                    <AlertDescription className="text-white md:text-foreground">{progress}</AlertDescription>
                                </Alert>
                            )}

                            {message && (
                                <Alert 
                                    variant={message.type === 'error' ? 'destructive' : 'default'} 
                                    className={`backdrop-blur-md md:bg-background md:border-border ${
                                        message.type === 'warning' 
                                            ? 'bg-yellow-900/80 border-yellow-500/50' 
                                            : 'bg-black/80 border-white/20'
                                    }`}
                                >
                                    {message.type === 'success' && <IconCheck className="h-4 w-4 text-white md:text-foreground" />}
                                    {message.type === 'error' && <IconAlertCircle className="h-4 w-4" />}
                                    {message.type === 'info' && <IconAlertCircle className="h-4 w-4 text-white md:text-foreground" />}
                                    {message.type === 'warning' && <IconAlertCircle className="h-4 w-4 text-yellow-300" />}
                                    <AlertDescription className={`${
                                        message.type === 'warning' ? 'text-yellow-100' : 'text-white md:text-foreground'
                                    }`}>
                                        {message.text}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Action Buttons - Fixed Bottom di Mobile */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent md:relative md:bg-transparent md:p-0">
                            <div className="flex gap-2">
                                {scanning && !processing && (
                                    <>
                                        <Button
                                            onClick={handleCapture}
                                            className="flex-1 h-14 md:h-10 text-lg md:text-base rounded-full md:rounded-md"
                                            disabled={processing}
                                        >
                                            <IconCamera className="h-6 w-6 md:h-4 md:w-4 mr-2" />
                                            Ambil Foto
                                        </Button>
                                        <Button
                                            onClick={handleClose}
                                            variant="outline"
                                            className="h-14 w-14 md:h-10 md:w-10 rounded-full md:rounded-md border-white/20 text-white hover:bg-white/10 md:border-border md:text-foreground"
                                        >
                                            <IconX className="h-6 w-6 md:h-4 md:w-4" />
                                        </Button>
                                    </>
                                )}

                                {capturedImage && !processing && (
                                    <Button
                                        onClick={handleRetake}
                                        variant="outline"
                                        className="flex-1 h-14 md:h-10 text-lg md:text-base rounded-full md:rounded-md border-white/20 text-white hover:bg-white/10 md:border-border md:text-foreground"
                                    >
                                        Ambil Ulang
                                    </Button>
                                )}

                                {processing && (
                                    <Button disabled className="flex-1 h-14 md:h-10 text-lg md:text-base rounded-full md:rounded-md">
                                        <IconLoader2 className="h-6 w-6 md:h-4 md:w-4 mr-2 animate-spin" />
                                        Memproses...
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}