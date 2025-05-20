import Link from "next/link";
import { ArrowLeft, BarChart3, Layers, Wallet, FlaskConical, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NovaComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="size-20 rounded-full bg-indigo-600/90 flex items-center justify-center">
            <BarChart3 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Nova <span className="text-indigo-500">is Coming Soon</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Your advanced on-chain data analysis assistant is under development
          </p>
          <div className="bg-indigo-500/10 rounded-lg px-4 py-2 text-indigo-700 dark:text-indigo-300 font-medium text-sm inline-flex items-center gap-2 mt-2">
            <Zap className="h-4 w-4" />
            Currently in beta development
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
          <div className="flex flex-col items-center p-6 rounded-xl border border-border/60 bg-card/50">
            <Wallet className="h-10 w-10 text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Liquidity Analysis</h3>
            <p className="text-muted-foreground text-center">
              Deep insights into DEX liquidity across multiple chains and protocols
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-xl border border-border/60 bg-card/50">
            <Layers className="h-10 w-10 text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">On-Chain Intelligence</h3>
            <p className="text-muted-foreground text-center">
              Analyze wallet activities, token movements, and smart contract interactions
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-xl border border-border/60 bg-card/50">
            <FlaskConical className="h-10 w-10 text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Agents</h3>
            <p className="text-muted-foreground text-center">
              Specialized agents for automated data collection and analysis
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-xl border border-border/60 bg-card/50">
            <BarChart3 className="h-10 w-10 text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Visual Analytics</h3>
            <p className="text-muted-foreground text-center">
              Interactive charts and visualizations for complex on-chain data
            </p>
          </div>
        </div>
        
        <div className="pt-8">
          <Link href="/home">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 