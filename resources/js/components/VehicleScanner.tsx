import { useState, useRef, useCallback, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IconCamera, IconLoader2, IconX, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VehicleScannerProps {
    onScanComplete: (data: {
        plat_nomor: string;
        jenis_kendaraan?: string;
        exists?: boolean;
        existingData?: any;
    }) => void;
}

export default function VehicleScanner({ onScanComplete }: VehicleScannerProps) {
    const [open, setOpen] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
    const [progress, setProgress] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const handleOpenCamera = async () => {
        setOpen(true);
        setScanning(true);
        setCapturedImage(null);
        setMessage(null);
        setProgress('');
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
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
            
            // Convert to blob with high quality for better vehicle detection
            canvas.toBlob((blob) => {
                if (blob) {
                    const imageSrc = URL.createObjectURL(blob);
                    setCapturedImage(imageSrc);
                    setScanning(false);
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
            setProgress('Mengirim ke server...');
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
                } else {
                    // Kendaraan baru
                    setMessage({
                        type: 'success',
                        text: `${responseMessage} - Confidence: ${data.confidence}%`
                    });
                    onScanComplete({
                        plat_nomor: data.plat_nomor,
                        jenis_kendaraan: data.jenis_kendaraan,
                        exists: false
                    });
                }

                // Tutup dialog setelah 2 detik
                setTimeout(() => {
                    setOpen(false);
                    resetScanner();
                }, 2000);
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
    };

    const resetScanner = () => {
        stopCamera();
        setCapturedImage(null);
        setScanning(false);
        setMessage(null);
        setProgress('');
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
                <DialogContent className="h-screen w-screen max-w-none p-0 gap-0 bg-black md:h-auto md:max-w-2xl md:rounded-lg md:p-6">
                    <DialogHeader className="p-4 md:p-0 absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent md:relative md:bg-transparent">
                        <DialogTitle className="text-white md:text-foreground">Scan Plat Nomor Kendaraan</DialogTitle>
                        <DialogDescription className="text-gray-200 md:text-muted-foreground">
                            Arahkan kamera ke plat nomor kendaraan dan ambil foto
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
                                    
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative w-4/5 max-w-md">
                                            <div className="border-4 border-green-500 rounded-lg p-4 bg-transparent backdrop-blur-none">
                                                <div className="aspect-[3/1] border-2 border-dashed border-green-400 rounded flex items-center justify-center">
                                                    <p className="text-green-400 text-sm font-medium text-center px-2">
                                                        Posisikan plat nomor di sini
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Corner indicators */}
                                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-lg"></div>
                                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg"></div>
                                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-lg"></div>
                                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-lg"></div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {capturedImage && (
                                <img
                                    src={capturedImage}
                                    alt="Captured"
                                    className="w-full h-full object-cover"
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
                                <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="bg-black/80 border-white/20 backdrop-blur-md md:bg-background md:border-border">
                                    {message.type === 'success' && <IconCheck className="h-4 w-4 text-white md:text-foreground" />}
                                    {message.type === 'error' && <IconAlertCircle className="h-4 w-4" />}
                                    {message.type === 'info' && <IconAlertCircle className="h-4 w-4 text-white md:text-foreground" />}
                                    <AlertDescription className="text-white md:text-foreground">{message.text}</AlertDescription>
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
