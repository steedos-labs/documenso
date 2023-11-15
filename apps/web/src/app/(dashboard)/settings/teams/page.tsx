import SettingsHeader from '~/components/(dashboard)/settings/layout/header';
import CreateTeamDialog from '~/components/(teams)/dialogs/create-team-dialog';
import TeamsDataTable from '~/components/(teams)/tables/teams-data-table';

export default function TeamsSettingsPage() {
  return (
    <div>
      <SettingsHeader title="Teams" subtitle="Manage all teams you are currently associated with.">
        <CreateTeamDialog />
      </SettingsHeader>

      <TeamsDataTable />
    </div>
  );
}
