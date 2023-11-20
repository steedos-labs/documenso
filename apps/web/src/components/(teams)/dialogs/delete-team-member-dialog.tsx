'use client';

import { useState } from 'react';

import { trpc } from '@documenso/trpc/react';
import { Avatar, AvatarFallback } from '@documenso/ui/primitives/avatar';
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
  teamMemberEmail: string;
  trigger?: React.ReactNode;
};

export default function DeleteTeamMemberDialog({
  trigger,
  teamId,
  teamName,
  teamMemberId,
  teamMemberName,
  teamMemberEmail,
}: DeleteTeamMemberDialogProps) {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const { mutateAsync: deleteTeamMembers, isLoading: isDeletingTeamMember } =
    trpc.team.deleteTeamMembers.useMutation();

  const handleRemoveTeamMember = async () => {
    try {
      await deleteTeamMembers({ teamId, teamMemberIds: [teamMemberId] });

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
            You are about to remove the following user from{' '}
            <span className="font-semibold">{teamName}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border-2 px-4 py-2">
          <div className="flex max-w-xs items-center gap-2">
            <Avatar className="dark:border-border h-12 w-12 border-2 border-solid border-white">
              <AvatarFallback className="text-xs text-gray-400">
                {teamMemberName.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col text-sm">
              <span className="text-foreground/80 font-semibold">{teamMemberName}</span>
              <span className="text-muted-foreground">{teamMemberEmail}</span>
            </div>
          </div>
        </div>

        <fieldset disabled={isDeletingTeamMember}>
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
              onClick={async () => handleRemoveTeamMember()}
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
