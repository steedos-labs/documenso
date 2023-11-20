'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { WEBAPP_BASE_URL } from '@documenso/lib/constants/app';
import { AppError, AppErrorCode } from '@documenso/lib/errors/app-error';
import { trpc } from '@documenso/trpc/react';
import { Button } from '@documenso/ui/primitives/button';
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

export type UpdateTeamDialogProps = {
  teamId: number;
  teamName: string;
  teamUrl: string;
};

export const ZUpdateTeamFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Please enter a valid name.' }),
  url: z.string().min(1, 'Please enter a value.'), // Todo: Teams - Restrict certain symbols.
});

export type TUpdateTeamFormSchema = z.infer<typeof ZUpdateTeamFormSchema>;

export default function UpdateTeamForm({ teamId, teamName, teamUrl }: UpdateTeamDialogProps) {
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(ZUpdateTeamFormSchema),
    defaultValues: {
      name: teamName,
      url: teamUrl,
    },
  });

  const { mutateAsync: updateTeam } = trpc.team.updateTeam.useMutation();

  const onFormSubmit = async ({ name, url }: TUpdateTeamFormSchema) => {
    try {
      await updateTeam({
        data: {
          name,
          url,
        },
        teamId,
      });

      toast({
        title: 'Success',
        description: 'Your team has been successfully updated.',
        duration: 5000,
      });

      form.reset({
        name,
        url,
      });

      if (url !== teamUrl) {
        router.push(`${WEBAPP_BASE_URL}/settings/teams/${url}`);
      }
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
          'We encountered an unknown error while attempting to update your team. Please try again later.',
      });
    }
  };

  return (
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
                    <Input className="bg-background" {...field} />
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
                        : 'A unique URL to identify your team'}
                    </span>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row justify-end space-x-4">
              <AnimatePresence>
                {form.formState.isDirty && (
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                  >
                    <Button type="button" variant="secondary" onClick={() => form.reset()}>
                      Reset
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" loading={form.formState.isSubmitting}>
                Update team
              </Button>
            </div>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}