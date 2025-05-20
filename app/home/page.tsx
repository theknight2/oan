"use client";

import Link from "next/link";
import { ArrowRight, Bot, Database, Sparkles, Globe, Code, BarChart2 } from "lucide-react";
import Image from "next/image";
import { GalaxyBackground } from "@/components/galaxy-background";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Add Galaxy Background */}
      <GalaxyBackground />
      
      {/* Hero Section */}
      <div className="relative w-full py-20 overflow-hidden bg-gradient-to-b from-background to-background/20">
        <div className="absolute inset-0 opacity-30 bg-grid-pattern"/>
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
        
        <div className="container px-4 mx-auto z-10 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="size-24 mx-auto mb-8">
              <Image 
                src="/alpha-logo.svg" 
                alt="OpenΑlpha Logo" 
                width={96} 
                height={96} 
                className="w-full h-full animate-fade-in"
                priority
              />
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Welcome to <span className="text-primary">OpenΑlpha</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto pt-2">
              Access real-time blockchain data, market insights, and powerful analysis tools through a seamless conversational interface
            </p>
            
            <div className="pt-6">
              <Link href="/chat" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105">
                Start Exploring <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="w-full py-16 bg-background/50 relative z-10">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Powerful Capabilities</h2>
            <p className="text-muted-foreground mt-2">Explore the diverse suite of tools at your fingertips</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto stagger-animation">
            <div className="flex flex-col items-center text-center p-6 rounded-xl hover-lift backdrop-blur-sm bg-card/10 border border-border/40">
              <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Data</h3>
              <p className="text-muted-foreground">
                Access up-to-the-minute blockchain and market data from multiple sources
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-xl hover-lift backdrop-blur-sm bg-card/10 border border-border/40">
              <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Database className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">On-chain Analysis</h3>
              <p className="text-muted-foreground">
                Analyze wallet activities, token movements, and smart contract interactions
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-xl hover-lift backdrop-blur-sm bg-card/10 border border-border/40">
              <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart2 className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Market Insights</h3>
              <p className="text-muted-foreground">
                Track prices, monitor social sentiment, and discover emerging projects
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tools Section */}
      <div className="w-full py-16 bg-background/30 relative z-10">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto stagger-animation">
            <div className="flex flex-col rounded-2xl p-8 border border-border/60 bg-card/30 backdrop-blur-sm hover:border-primary hover:shadow-lg transition-all hover:bg-card/50 hover-lift">
              <div className="flex items-center mb-4">
                <div className="size-12 rounded-xl bg-primary/15 flex items-center justify-center mr-4">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Nebula</h2>
              </div>
              <p className="text-muted-foreground flex-1 mb-6">
                Your crypto-focused AI assistant with access to real-time blockchain data.
                Get price updates, security checks, and market analysis through a conversational interface.
              </p>
              <Link 
                href="/chat"
                className="inline-flex items-center justify-center rounded-lg bg-primary/90 px-5 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary self-start mt-auto"
              >
                Chat with Nebula <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="flex flex-col rounded-2xl p-8 border border-border/60 bg-card/30 backdrop-blur-sm hover:border-primary hover:shadow-lg transition-all hover:bg-card/50 hover-lift">
              <div className="flex items-center mb-4">
                <div className="size-12 rounded-xl bg-primary/15 flex items-center justify-center mr-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Nova</h2>
              </div>
              <p className="text-muted-foreground flex-1 mb-6">
                Specialized AI built for data analysis and visualization with
                advanced reasoning capabilities. Dive deep into on-chain metrics,
                create custom visualizations, and discover hidden patterns.
              </p>
              <Link 
                href="/nova"
                className="inline-flex items-center justify-center rounded-lg bg-primary/90 px-5 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary self-start mt-auto"
              >
                Explore Nova <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="w-full py-16 bg-background/50 relative z-10">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center backdrop-blur-sm p-8 rounded-2xl border border-border/40 bg-card/10">
            <h2 className="text-3xl font-bold mb-4">Ready to start your <span className="gradient-text">journey</span>?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Begin exploring the world of blockchain data and insights with powerful AI tools
            </p>
            <Link 
              href="/chat"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-105"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Add a subtle grid pattern */}
      <style jsx global>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(100, 100, 100, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(100, 100, 100, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--from), var(--via) 30%, var(--to) 70%);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .gradient-text {
          background: linear-gradient(90deg, var(--color-primary), #a855f7);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline;
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.2);
        }
      `}</style>
    </div>
  );
} 