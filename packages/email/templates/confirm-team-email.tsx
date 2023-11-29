import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

import config from '@documenso/tailwind-config';

import { TemplateFooter } from '../template-components/template-footer';

export type TeamInviteEmailProps = {
  baseUrl: string;
  teamName: string;
  teamUrl: string;
  token: string;
};

export const ConfirmTeamEmailTemplate = ({
  baseUrl = 'https://documenso.com',
  teamName = 'Documenso',
  teamUrl = 'demo',
  token = '',
}: TeamInviteEmailProps) => {
  const previewText = `Accept team email request for ${teamName} on Documenso`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: config.theme.extend.colors,
            },
          },
        }}
      >
        <Body className="mx-auto my-auto font-sans">
          <Section className="bg-white">
            <Container className="mx-auto mb-2 mt-8 max-w-xl rounded-lg border border-solid border-slate-200 p-2 backdrop-blur-sm">
              <Section className="p-2">
                <Text className="text-base text-slate-400">
                  <span className="font-bold">{teamName}</span> ({baseUrl}/t/{teamUrl}) has
                  requested to use your email address as part of their team on Documenso.
                </Text>

                <Text className="my-1 text-base text-slate-400">
                  By accepting this request, you will give access to {teamName} to do the following:
                </Text>

                <ul>
                  <li>
                    <Text>View all documents sent to this email address</Text>
                    <Text>Allow document recipients to reply directly to this email address</Text>
                  </li>
                </ul>

                <Text>
                  You can revoke access at any time in your team settings on Documenso{' '}
                  <Link href={`${baseUrl}/settings/teams`}>here.</Link>
                </Text>

                <Button
                  className="rounded-lg border border-solid border-slate-200 px-4 py-2 text-center text-sm font-medium text-black no-underline"
                  href={`${baseUrl}/verify/team-email/${token}`}
                >
                  Accept
                </Button>

                <Text className="text-center text-xs">This token expires in 10 minutes.</Text>
              </Section>
            </Container>

            <Hr className="mx-auto mt-12 max-w-xl" />

            <Container className="mx-auto max-w-xl">
              <TemplateFooter isDocument={false} />
            </Container>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ConfirmTeamEmailTemplate;
