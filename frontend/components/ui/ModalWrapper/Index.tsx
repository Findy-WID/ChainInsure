import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ModalWrapperProps {
  children: React.ReactNode;
  triggerElement: React.ReactNode;
  title: string;
  content: React.ReactElement;
}

export function ModalWrapper({ children, triggerElement, title, content }: ModalWrapperProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerElement}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px] max-h-[90%] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}