import { Head } from "@inertiajs/react";
import { ReactNode } from "react";


export default function DashboardHeader({ children, title, description }: { children?: ReactNode, title: string, description: string }) {
    return (
        <>
            <Head title={title} />
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {title}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
                {children || ''}
            </div>
        </>
    )
}