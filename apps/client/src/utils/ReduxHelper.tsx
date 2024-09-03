export default class ReduxHelper {
  public static getParticularIntegrations(
    integrations: any,
    type: string,
    not: boolean = true
  ) {
    return integrations.filter((integration: any) =>
      not ? integration.type === type : integration.type !== type
    );
  }
}
