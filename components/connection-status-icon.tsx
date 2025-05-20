"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

type ConnectionStatus = "connected" | "disconnected" | "connecting" | "error";

interface ConnectionStatusIconProps {
    status: ConnectionStatus;
    size?: number;
    showTooltip?: boolean;
    className?: string;
}

export function ConnectionStatusIcon({
    status,
    size = 16,
    showTooltip = true,
    className,
}: ConnectionStatusIconProps) {
    const getStatusDetails = () => {
        switch (status) {
            case "connected":
                return {
                    icon: <CheckCircle className="text-green-500" size={size} />,
                    label: "Connected",
                    description: "Connection is active and working",
                };
            case "disconnected":
                return {
                    icon: <XCircle className="text-gray-400" size={size} />,
                    label: "Disconnected",
                    description: "Not connected",
                };
            case "connecting":
                return {
                    icon: (
                        <div className="animate-pulse">
                            <AlertCircle className="text-amber-500" size={size} />
                        </div>
                    ),
                    label: "Connecting",
                    description: "Establishing connection...",
                };
            case "error":
                return {
                    icon: <XCircle className="text-red-500" size={size} />,
                    label: "Error",
                    description: "Connection failed",
                };
            default:
                return {
                    icon: <AlertCircle className="text-gray-400" size={size} />,
                    label: "Unknown",
                    description: "Status unknown",
                };
        }
    };

    const { icon, label, description } = getStatusDetails();

    if (!showTooltip) {
        return <div className={cn("flex items-center", className)}>{icon}</div>;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className={cn("flex items-center cursor-help", className)}>
                    {icon}
                </div>
            </TooltipTrigger>
            <TooltipContent side="top">
                <div className="flex flex-col gap-1">
                    <div className="font-semibold">{label}</div>
                    <div className="text-xs opacity-80">{description}</div>
                </div>
            </TooltipContent>
        </Tooltip>
    );
} 