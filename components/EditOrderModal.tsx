// components/EditOrderModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Order } from './OrderList';

interface EditOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onSave: (updated: Order) => void;
  onClose: () => void;
}

export default function EditOrderModal({ order, isOpen, onSave, onClose }: EditOrderModalProps) {
  const [editOrder, setEditOrder] = useState<Order | null>(order);

  useEffect(() => {
    setEditOrder(order);
  }, [order]);

  const handleSave = () => {
    if (editOrder) onSave(editOrder);
    onClose();
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-[10000]" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10001] max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="poNumber">PO#</Label>
              <Input
                id="poNumber"
                value={editOrder?.poNumber || ''}
                onChange={e => setEditOrder(prev => prev && { ...prev, poNumber: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                value={editOrder?.status || ''}
                onChange={e => setEditOrder(prev => prev && { ...prev, status: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="eta">ETA</Label>
              <Input
                id="eta"
                value={editOrder?.eta || ''}
                onChange={e => setEditOrder(prev => prev && { ...prev, eta: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
