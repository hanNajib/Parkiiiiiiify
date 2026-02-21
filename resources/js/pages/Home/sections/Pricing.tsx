import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { pricingPlans } from '@/config/homeData';

export default function PricingSection() {
    return (
        <section id="harga" className="container mx-auto px-4 py-20 bg-slate-50/50 border-y border-slate-100 dark:bg-zinc-900/50 dark:border-zinc-800">
            <div className="text-center space-y-4 mb-16">
                <Badge variant="secondary" className="w-fit mx-auto gap-1">
                    <DollarSign className="w-3 h-3" />
                    Harga Transparan
                </Badge>
                <h2 className="text-4xl md:text-6xl font-bold">
                    Pilih Paket yang{' '}
                    <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Pas untuk Anda
                    </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Mulai gratis, upgrade kapan saja. Tanpa komitmen jangka panjang.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {pricingPlans.map((plan, index) => (
                    <Card key={index} className={`relative h-full transition-all ${plan.highlighted ? 'border-primary shadow-2xl shadow-primary/10 scale-105 dark:bg-zinc-900 dark:shadow-none' : 'border-slate-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 dark:border-zinc-800 dark:hover:border-primary/50'}`}>
                        {plan.highlighted && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <Badge className="gap-1 px-4 py-1">
                                    <Award className="w-3 h-3" />
                                    Paling Populer
                                </Badge>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                            <div className="pt-4">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-muted-foreground">
                                    {plan.period && ` ${plan.period}`}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Separator />
                            <ul className="space-y-3">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Link href="/register" className="w-full">
                                <Button
                                    className="w-full gap-2"
                                    variant={plan.highlighted ? "default" : "outline"}
                                    size="lg"
                                >
                                    {plan.name === "Enterprise" ? "Hubungi Sales" : "Mulai Sekarang"}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="text-center mt-12">
                <p className="text-muted-foreground">
                    Semua paket termasuk: Barcode Scanner, Export PDF/Excel, Multi-area Support, dan Log Aktivitas
                </p>
            </div>
        </section>
    );
}
