import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Forms = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Termos de Uso</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        Data de vigência: 22 de julho de 2025
      </DialogDescription>
      <div className="text-muted-foreground max-h-[60vh] space-y-4 overflow-y-auto px-4 py-2 text-sm">
        <p>
          Bem-vindo ao <b>iGenda</b>! Ao acessar ou utilizar nosso serviço, você
          concorda com os seguintes Termos de Uso. Leia atentamente antes de
          utilizar o serviço.
        </p>
        <ol className="list-inside list-decimal space-y-2">
          <li>
            <b>Definições</b>
            <br />
            “Serviço” refere-se ao software disponibilizado por <b>Synqia</b>,
            acessível via navegador ou aplicativo, que permite gerenciar
            agendamentos online, estoque, clientes, serviços, etc.
            <br />
            “Usuário” ou “Você” refere-se à pessoa física ou jurídica que acessa
            ou utiliza o Serviço.
            <br />
            “Nós”, “Nosso” ou “Empresa” refere-se a <b>Synqia</b>, responsável
            pela oferta do Serviço.
          </li>
          <li>
            <b>Aceitação dos Termos</b>
            <br />
            Ao criar uma conta, acessar ou usar o Serviço, você declara que leu,
            entendeu e concorda em ficar vinculado a estes Termos. Se não
            concordar, não utilize o Serviço.
          </li>
          <li>
            <b>Conta de Usuário</b>
            <br />
            Para utilizar o Serviço, é necessário criar uma conta, fornecendo
            informações verdadeiras e atualizadas.
            <br />
            Você é responsável por manter a confidencialidade de suas
            credenciais de acesso.
            <br />A Empresa não se responsabiliza por atividades realizadas com
            sua conta caso suas credenciais sejam comprometidas.
          </li>
          <li>
            <b>Uso Permitido</b>
            <br />
            Você concorda em utilizar o Serviço somente para fins legais e
            conforme previsto nestes Termos. É proibido:
            <ul className="ml-4 list-inside list-disc">
              <li>Usar o Serviço para atividades ilegais ou prejudiciais;</li>
              <li>Violar direitos de terceiros;</li>
              <li>Tentar acessar sistemas sem autorização.</li>
            </ul>
          </li>
          <li>
            <b>Planos e Pagamentos</b>
            <br />
            Alguns recursos podem estar disponíveis somente por meio de planos
            pagos.
            <br />
            O pagamento deve ser realizado conforme os termos especificados no
            momento da contratação.
            <br />O não pagamento poderá resultar na suspensão ou encerramento
            da sua conta.
          </li>
          <li>
            <b>Cancelamento e Encerramento</b>
            <br />
            Você pode encerrar sua conta a qualquer momento através do painel do
            usuário.
            <br />A Empresa reserva-se o direito de encerrar ou suspender contas
            que violem estes Termos, sem aviso prévio.
          </li>
          <li>
            <b>Propriedade Intelectual</b>
            <br />
            Todo o conteúdo e tecnologia utilizados no Serviço são de
            propriedade da Empresa ou de seus licenciadores e são protegidos por
            leis de direitos autorais, marcas e outras legislações aplicáveis.
          </li>
          <li>
            <b>Limitação de Responsabilidade</b>
            <br />O Serviço é fornecido “como está”, sem garantias de
            funcionamento ininterrupto ou livre de erros. A Empresa não será
            responsável por danos diretos, indiretos, incidentais ou
            consequenciais resultantes do uso ou da incapacidade de uso do
            Serviço.
          </li>
          <li>
            <b>Modificações nos Termos</b>
            <br />A Empresa pode atualizar estes Termos a qualquer momento. Você
            será notificado sobre alterações relevantes e o uso contínuo do
            Serviço após tal notificação constituirá aceitação dos novos Termos.
          </li>
          <li>
            <b>Legislação Aplicável</b>
            <br />
            Estes Termos serão regidos pelas leis da República Federativa do
            Brasil. Fica eleito o foro da comarca de <b>Itumbiara</b>, estado de{" "}
            <b>Goiás</b>, para dirimir quaisquer questões oriundas deste
            contrato.
          </li>
          <li>
            <b>Contato</b>
            <br />
            Se você tiver dúvidas sobre estes Termos, entre em contato conosco
            através de <b>contato@synqia.com.br</b>.
          </li>
        </ol>
      </div>
    </DialogContent>
  );
};

export default Forms;
