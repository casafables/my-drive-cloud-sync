
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { fileApi } from '@/api/apiClient';
import { useToast } from '@/hooks/use-toast';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  currentName: string;
  onRenameComplete: () => void;
}

const formSchema = z.object({
  newName: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name is too long'),
});

export function RenameModal({
  isOpen,
  onClose,
  itemId,
  currentName,
  onRenameComplete,
}: RenameModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newName: currentName,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.newName === currentName) {
      onClose();
      return;
    }

    try {
      setIsLoading(true);
      await fileApi.rename(itemId, values.newName);
      toast({
        title: 'Success',
        description: 'Item renamed successfully',
      });
      onClose();
      onRenameComplete();
    } catch (error: any) {
      console.error('Error renaming item:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to rename item',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter new name" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-drive-blue hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
