import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-session';

// import { ProfileForm } from '~/components/forms/profile';

export default async function TeamsSettingBillingPage() {
  const { user } = await getRequiredServerComponentSession();

  return <div>todo</div>;
}
