import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-component-session';
import { getTeamByUrl } from '@documenso/lib/server-only/team/get-teams';
import { Button } from '@documenso/ui/primitives/button';
import { Card, CardContent } from '@documenso/ui/primitives/card';

import SettingsHeader from '~/components/(dashboard)/settings/layout/header';
import TeamBillingInvoicesDataTable from '~/components/(teams)/tables/team-billing-invoices-data-table';

export type TeamsSettingsBillingPageProps = {
  params: {
    teamUrl: string;
  };
};

export default async function TeamsSettingBillingPage({ params }: TeamsSettingsBillingPageProps) {
  const { teamUrl } = params;

  const session = await getRequiredServerComponentSession();

  await getTeamByUrl({ userId: session.user.id, teamUrl });

  return (
    <div>
      <SettingsHeader title="Billing" subtitle="Your subscription is currently active." />

      <Card gradient className="shadow-sm">
        <CardContent className="flex flex-row items-center justify-between p-4">
          <div className="flex flex-col text-sm">
            <p className="text-foreground font-semibold">Current plan: Team</p>
            <p className="text-muted-foreground mt-0.5">
              {2} members • Monthly • Renews: Dec 02, 2030
            </p>
          </div>

          <div className="space-x-2">
            <Button variant="outline">Cancel plan</Button>
            <Button>Update billing details</Button>
          </div>
        </CardContent>
      </Card>

      <section className="mt-6">
        <TeamBillingInvoicesDataTable />
      </section>
    </div>
  );
}
