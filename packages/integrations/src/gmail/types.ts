export type ConnectConfig = {
  code: string;
  redirect_url: string;
};

export enum GmailAction {
  SEND_MAIL = 'SEND_MAIL',
  SCHEDULE_MAIL = 'SCHEDULE_MAIL',
}

export type GmailIntegrationData = {
  googleId: string;
  accessToken: string;
  refreshToken: string;
  email: string;
  name: string;
};
