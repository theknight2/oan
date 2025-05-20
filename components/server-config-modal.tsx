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
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import type { MCPServer } from "@/lib/context/mcp-context";

interface ServerConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (server: MCPServer) => void;
    initialData?: MCPServer;
}

export function ServerConfigModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}: ServerConfigModalProps) {
    const [serverConfig, setServerConfig] = useState<MCPServer>(
        initialData || {
            id: crypto.randomUUID(),
            name: "",
            url: "",
            providerToolPath: "",
            requiresAuth: false,
            authToken: "",
        }
    );
    const { toast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setServerConfig((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!serverConfig.name.trim() || !serverConfig.url.trim() || !serverConfig.providerToolPath.trim()) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        onSubmit(serverConfig);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit" : "Add"} MCP Server</DialogTitle>
                    <DialogDescription>
                        Configure a custom MCP server to access additional tools.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="name" className="text-right col-span-1">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="My Custom Server"
                                value={serverConfig.name}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="url" className="text-right col-span-1">
                                URL
                            </Label>
                            <Input
                                id="url"
                                name="url"
                                placeholder="https://example.com"
                                value={serverConfig.url}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="providerToolPath" className="text-right col-span-1">
                                Path
                            </Label>
                            <Input
                                id="providerToolPath"
                                name="providerToolPath"
                                placeholder="/tools/sse"
                                value={serverConfig.providerToolPath}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                            <div className="col-span-4 text-xs text-muted-foreground">
                                The API path to the tools on the server, e.g. /tools/sse
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="requiresAuth" className="text-right col-span-1">
                                Auth Token
                            </Label>
                            <Input
                                id="authToken"
                                name="authToken"
                                placeholder="Auth token (optional)"
                                value={serverConfig.authToken || ""}
                                onChange={handleChange}
                                className="col-span-3"
                            />
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