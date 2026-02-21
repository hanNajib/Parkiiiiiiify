import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/config/homeData';

export default function FAQSection() {
    return (
        <section id="faq" className="container mx-auto px-4 py-20">
            <div className="text-center space-y-4 mb-16">
                <Badge variant="secondary" className="w-fit mx-auto">
                    FAQ
                </Badge>
                <h2 className="text-4xl md:text-6xl font-bold">
                    Pertanyaan yang{' '}
                    <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Sering Ditanyakan
                    </span>
                </h2>
            </div>

            <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <div className="text-center mt-12">
                <p className="text-muted-foreground mb-4">Masih punya pertanyaan?</p>
                <Button variant="outline" size="lg">
                    Hubungi Support
                </Button>
            </div>
        </section>
    );
}
