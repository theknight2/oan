"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface APIKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (apiKey: string) => void;
    apiKeyName: string;
    apiKeyLabel?: string;
}

export function APIKeyModal({ 
    isOpen, 
    onClose, 
    onSubmit, 
    apiKeyName, 
    apiKeyLabel = "API Key" 
}: APIKeyModalProps) {
    const [apiKey, setApiKey] = useState("");
    const [showKey, setShowKey] = useState(false);
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!apiKey.trim()) {
            toast({
                title: "Error",
                description: `Please enter a valid ${apiKeyName} API key`,
                variant: "destructive",
            });
            return;
        }
        
        onSubmit(apiKey);
        setApiKey("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{apiKeyName} API Key</DialogTitle>
                    <DialogDescription>
                        Enter your {apiKeyName} API key to use this service.
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="apiKey" className="text-right">
                            {apiKeyLabel}
                        </Label>
                        <div className="flex items-center space-x-2">
                            <div className="relative flex-1">
                                <Input
                                    id="apiKey"
                                    type={showKey ? "text" : "password"}
                                    placeholder={`Enter your ${apiKeyName} API key`}
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowKey(!showKey)}
                                >
                                    {showKey ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 