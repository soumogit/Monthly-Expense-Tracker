"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Handshake } from "lucide-react"

interface WelcomePopupProps {
  isOpen: boolean
  onClose: () => void
  username: string
}

export function WelcomePopup({ isOpen, onClose, username }: WelcomePopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader className="text-center">
          <Sparkles className="mx-auto h-12 w-12 text-yellow-500 mb-2" />
          <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {username}!</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
            We're thrilled to have you on board. Let's get your finances organized!
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 mt-4">
          <Handshake className="h-5 w-5" />
          <span className="font-medium">Your financial journey starts now.</span>
        </div>
        <DialogFooter className="mt-6">
          <Button onClick={onClose} className="w-full">
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
