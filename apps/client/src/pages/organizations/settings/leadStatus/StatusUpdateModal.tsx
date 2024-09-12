import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const StatusUpdateModal = ({ isOpen, onClose, status, onUpdate }: any) => {
  const [newStatus, setNewStatus] = useState(status?.status || "");

  const handleUpdate = () => {
    onUpdate({ ...status, status: newStatus });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Update Status</DialogTitle>
        <div className="space-y-4">
            <Label className="text-sm font-medium">Status</Label>
          <Input
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={!newStatus}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateModal;
