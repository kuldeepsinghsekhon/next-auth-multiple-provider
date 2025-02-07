
import { TooltipProvider } from "@/components/ui/tooltip"
export async function  Providers({ children }: { children: React.ReactNode }) {

 return (
    <TooltipProvider>
    {children}
    </TooltipProvider>

 )
}

