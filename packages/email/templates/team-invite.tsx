import config from '@documenso/tailwind-config';

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '../components';
import { TemplateFooter } from '../template-components/template-footer';

export type TeamInviteEmailProps = {
  baseUrl: string;
  teamName: string;
  token: string;
};

export const TeamInviteEmailTemplate = ({
  baseUrl = 'https://documenso.com',
  teamName = 'Documenso',
  token = '',
}: TeamInviteEmailProps) => {
  const previewText = `Accept the invitation to join Todo: Teams`;

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
                <Text className="text-center text-base text-slate-400">
                  Join {teamName} on Documenso
                </Text>

                <Text className="my-1 text-center text-base text-slate-400">
                  You have been invited by {teamName} to join their team on Documenso.
                </Text>

                <Button
                  className="rounded-lg border border-solid border-slate-200 px-4 py-2 text-center text-sm font-medium text-black no-underline"
                  href={`${baseUrl}/invite/teams/${token}`}
                >
                  Accept
                </Button>
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

export default TeamInviteEmailTemplate;
