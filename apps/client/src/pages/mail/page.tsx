import { Mail } from "./components/mail";
import { accounts, mails } from "./data";

export function MailPage() {
  return (
    <Mail
      accounts={accounts}
      mails={mails}
      navCollapsedSize={4}
      defaultLayout={undefined}
    />
  );
}
