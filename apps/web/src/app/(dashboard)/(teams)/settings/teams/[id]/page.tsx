import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-session';

// import { ProfileForm } from '~/components/forms/profile';

export default async function TeamsSettingsPage() {
  const { user } = await getRequiredServerComponentSession();

  return <div>asdf</div>;
}
