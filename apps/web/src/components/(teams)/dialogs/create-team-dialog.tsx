'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { WEBAPP_BASE_URL } from '@documenso/lib/constants/app';
import { AppError, AppErrorCode } from '@documenso/lib/errors/app-error';
import { DocumentData } from '@documenso/prisma/client';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@documenso/ui/primitives/form/form';
import { Input } from '@documenso/ui/primitives/input';
import { useToast } from '@documenso/ui/primitives/use-toast';

export type CreateTeamDialogProps = {
  trigger?: React.ReactNode;
} & Omit<DialogPrimitive.DialogProps, 'children'>;

export const ZCreateTeamFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Please enter a valid name.' }),
  url: z.string().min(1, 'Please enter a value.'), // Todo: Teams - Restrict certain symbols.
});

export type TCreateTeamFormSchema = z.infer<typeof ZCreateTeamFormSchema>;

export default function CreateTeamDialog({ trigger, ...props }: CreateTeamDialogProps) {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(ZCreateTeamFormSchema),
    defaultValues: {
      name: '',
      url: '',
    },
  });

  const { mutateAsync: createTeam } = trpc.team.createTeam.useMutation();

  const onFormSubmit = async ({ name, url }: TCreateTeamFormSchema) => {
    try {
      await createTeam({
        name,
        url,
      });

      toast({
        title: 'Success',
        description: 'Your team has been successfully created.',
        duration: 5000,
      });

      setOpen(false);
    } catch (err) {
      const error = AppError.parseError(err);

      if (error.code === AppErrorCode.ALREADY_EXISTS) {
        form.setError('url', {
          type: 'manual',
          message: 'This URL is already in use.',
        });

        return;
      }

      toast({
        title: 'An unknown error occurred',
        variant: 'destructive',
        description:
          'We encountered an unknown error while attempting to create a team. Please try again later.',
      });
    }
  };

  const mapTextToUrl = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <Dialog
      {...props}
      open={open}
      onOpenChange={(value) => !form.formState.isSubmitting && setOpen(value)}
    >
      <DialogTrigger onClick={(e) => e.stopPropagation()} asChild={true}>
        {trigger ?? <Button variant="secondary">Create team</Button>}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>

          <DialogDescription className="mt-4">Todo: Teams</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)}>
            <fieldset className="flex h-full flex-col" disabled={form.formState.isSubmitting}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Team Name</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background"
                          {...field}
                          onChange={(event) => {
                            const oldGenericUrl = mapTextToUrl(field.value);
                            const newGenericUrl = mapTextToUrl(event.target.value);

                            const urlField = form.getValues('url');
                            if (urlField === oldGenericUrl) {
                              form.setValue('url', newGenericUrl);
                            }

                            field.onChange(event);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Team URL</FormLabel>
                      <FormControl>
                        <Input className="bg-background" {...field} />
                      </FormControl>
                      {!form.formState.errors.url && (
                        <span className="text-foreground/50 text-xs font-normal">
                          {field.value
                            ? `${WEBAPP_BASE_URL}/t/${field.value}`
                            : 'A unique URL to encapsulate your team'}
                        </span>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Todo: Teams avatar */}

                <DialogFooter className="space-x-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setOpen(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>

                  <Button type="submit" className="w-full" loading={form.formState.isSubmitting}>
                    Create Team
                  </Button>
                </DialogFooter>
              </div>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
