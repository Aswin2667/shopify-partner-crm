
export abstract class IntegrationService<T> {
  /**
   * Connects to the integration service using the provided configuration.
   * @param config - Configuration object for the connection.
   * @returns An object containing the connection data and any error messages.
   */
  public abstract connect(
    config: object,
  ): Promise<{ data: T | null; error: string | null }>;

  /**
   * Disconnects from the integration service.
   * @returns An object indicating whether the disconnection was successful and any error messages.
   */
  public abstract disconnect(): Promise<{
    success: boolean;
    error: string | null;
  }>;

  /**
   * Checks if the integration service is currently connected.
   * @returns A boolean indicating the connection status.
   */
  public abstract isConnected(): boolean;

  /**
   * Performs a specific action on the integration service.
   * @param action - The action to be performed.
   * @param params - Parameters for the action.
   * @returns An object containing the result of the action and any error messages.
   */
  public abstract performAction(
    action: string,
    params: object,
  ): Promise<{ data: T | null; error: string | null }>;
}
