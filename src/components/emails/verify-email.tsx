import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerifyEmailProps {
  username: string;
  verifyUrl: string;
}

const VerifyEmail = (props: VerifyEmailProps) => {
  const { username, verifyUrl } = props;
  return (
    <Html lang="pt-BR" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[32px]">
            <Section>
              <Text className="mt-0 mb-[16px] text-[24px] font-bold text-gray-900">
                Verifique seu endereço de e-mail
              </Text>

              <Text className="mt-0 mb-[24px] text-[16px] leading-[24px] text-gray-700">
                Olá {username}! Obrigado por se cadastrar na iGenda. Para
                concluir seu cadastro e proteger sua conta, por favor verifique
                seu endereço de e-mail clicando no botão abaixo.
              </Text>

              <Section className="mb-[32px] text-center">
                <Button
                  href={verifyUrl}
                  className="box-border rounded-[6px] bg-green-600 px-[32px] py-[12px] text-[16px] font-medium text-white no-underline"
                >
                  Verificar e-mail
                </Button>
              </Section>

              <Text className="mt-0 mb-[24px] text-[14px] leading-[20px] text-gray-600">
                Se o botão acima não funcionar, copie e cole este link no seu
                navegador:
                <br />
                {verifyUrl}
              </Text>

              <Text className="mt-0 mb-[32px] text-[14px] leading-[20px] text-gray-600">
                Este link de verificação irá expirar em 24 horas. Se você não
                criou uma conta, pode ignorar este e-mail com segurança.
              </Text>

              <Hr className="my-[24px] border-gray-200" />

              <Text className="m-0 text-[12px] leading-[16px] text-gray-500">
                Atenciosamente,
                <br />
                Equipe iGenda
              </Text>
            </Section>

            <Section className="mt-[32px] border-t border-gray-200 pt-[24px]">
              <Text className="m-0 mt-[8px] text-center text-[12px] leading-[16px] text-gray-400">
                <a href="#" className="text-gray-400 underline">
                  Cancelar inscrição
                </a>{" "}
                | © 2024 iGenda. Todos os direitos reservados.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerifyEmail;
