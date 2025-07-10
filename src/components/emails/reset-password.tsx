import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ForgotPasswordEmailProps {
  username: string;
  resetUrl: string;
  userEmail: string;
}

const ForgotPasswordEmail = (props: ForgotPasswordEmailProps) => {
  const { username, resetUrl, userEmail } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Redefina sua senha - Ação necessária</Preview>
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[40px] shadow-sm">
            {/* Header */}
            <Section className="mb-[32px] text-center">
              <Heading className="m-0 mb-[8px] text-[28px] font-bold text-gray-900">
                Redefina sua senha
              </Heading>
              <Text className="m-0 text-[16px] text-gray-600">
                Recebemos uma solicitação para redefinir sua senha
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="m-0 mb-[16px] text-[16px] leading-[24px] text-gray-700">
                Olá, {username}
              </Text>
              <Text className="m-0 mb-[16px] text-[16px] leading-[24px] text-gray-700">
                Recebemos uma solicitação para redefinir a senha da sua conta
                associada ao e-mail {userEmail}.
              </Text>
              <Text className="m-0 mb-[24px] text-[16px] leading-[24px] text-gray-700">
                Clique no botão abaixo para criar uma nova senha. Este link irá
                expirar em 24 horas por motivos de segurança.
              </Text>
            </Section>

            {/* Reset Button */}
            <Section className="mb-[32px] text-center">
              <Button
                href={resetUrl}
                className="box-border inline-block rounded-[8px] bg-green-600 px-[32px] py-[16px] text-[16px] font-semibold text-white no-underline"
              >
                Redefinir senha
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-[32px]">
              <Text className="m-0 mb-[16px] text-[14px] leading-[20px] text-gray-600">
                Se o botão acima não funcionar, copie e cole este link no seu
                navegador:
              </Text>
              <Text className="m-0 text-[14px] leading-[20px] break-all text-green-600">
                {resetUrl}
              </Text>
            </Section>

            {/* Security Notice */}
            <Section className="mb-[32px] border-t border-gray-200 pt-[24px]">
              <Text className="m-0 mb-[12px] text-[14px] leading-[20px] text-gray-600">
                <strong>Aviso de segurança:</strong>
              </Text>
              <Text className="m-0 mb-[8px] text-[14px] leading-[20px] text-gray-600">
                • Se você não solicitou a redefinição de senha, ignore este
                e-mail
              </Text>
              <Text className="m-0 mb-[8px] text-[14px] leading-[20px] text-gray-600">
                • Este link irá expirar em 24 horas
              </Text>
              <Text className="m-0 text-[14px] leading-[20px] text-gray-600">
                • Por segurança, nunca compartilhe este link com ninguém
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px] text-center">
              <Text className="m-0 mb-[8px] text-[12px] leading-[16px] text-gray-500">
                Este e-mail foi enviado para{" "}
                <strong className="text-green-600">{userEmail}</strong>
              </Text>
              <Text className="m-0 mb-[8px] text-[12px] leading-[16px] text-gray-500">
                © 2025 iGenda. Todos os direitos reservados.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ForgotPasswordEmail;
