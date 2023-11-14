'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { trpc } from '@documenso/trpc/react';
import { Button } from '@documenso/ui/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@documenso/ui/primitives/dialog';
import { useToast } from '@documenso/ui/primitives/use-toast';

export type DeleteTeamMemberDialogProps = {
  teamId: number;
  teamName: string;
  teamMemberId: number;
  teamMemberName: string;
  trigger?: React.ReactNode;
};

export default function DeleteTeamMemberDialog({
  trigger,
  teamId,
  teamName,
  teamMemberId,
  teamMemberName,
}: DeleteTeamMemberDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const { mutateAsync: deleteTeamMember, isLoading: isDeletingTeamMember } =
    trpc.team.removeTeamMember.useMutation();

  const handleDeleteTeamMember = async () => {
    try {
      await deleteTeamMember({ teamId, teamMemberIds: [teamMemberId] });

      router.refresh();

      toast({
        title: 'Success',
        description: 'You have successfully removed this user from the team.',
        duration: 5000,
      });

      setOpen(false);
    } catch (err) {
      toast({
        title: 'An unknown error occurred',
        variant: 'destructive',
        duration: 10000,
        description:
          'We encountered an unknown error while attempting to remove this user. Please try again later.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !isDeletingTeamMember && setOpen(value)}>
      <DialogTrigger asChild={true}>
        {trigger ?? <Button variant="secondary">Delete team member</Button>}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>

          <DialogDescription className="mt-4">
            You are about to remove <span className="font-semibold">{teamMemberName}</span> from{' '}
            <span className="font-semibold">{teamName}</span>.
          </DialogDescription>
        </DialogHeader>

        <fieldset className="flex h-full flex-col space-y-4" disabled={isDeletingTeamMember}>
          <DialogFooter className="space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              className="w-full"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="destructive"
              loading={isDeletingTeamMember}
              onClick={async () => handleDeleteTeamMember()}
              className="w-full"
            >
              Delete
            </Button>
          </DialogFooter>
        </fieldset>
      </DialogContent>
    </Dialog>
  );
}
