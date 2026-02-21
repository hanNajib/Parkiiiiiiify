import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '@/config/homeData';

export default function TestimonialsSection() {
    return (
        <section id="testimoni" className="container mx-auto px-4 py-20">
            <div className="text-center space-y-4 mb-16">
                <Badge variant="secondary" className="w-fit mx-auto gap-1">
                    <Star className="w-3 h-3" />
                    Testimoni Pengguna
                </Badge>
                <h2 className="text-4xl md:text-6xl font-bold">
                    Feedback dari{' '}
                    <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Pengguna Sistem
                    </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Lihat bagaimana Parkify membantu mengelola area parkir
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="hover:shadow-xl hover:shadow-primary/5 transition-all border-slate-200 dark:border-zinc-800 h-full">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-12 h-12">
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {testimonial.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-base">{testimonial.name}</CardTitle>
                                        <CardDescription className="text-xs">{testimonial.role}</CardDescription>
                                    </div>
                                </div>
                                <Quote className="w-8 h-8 text-primary/20" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-1">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                ))}
                            </div>
                            <p className="text-sm leading-relaxed italic">"{testimonial.content}"</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
