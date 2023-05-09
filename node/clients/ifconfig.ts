import type { InstanceOptions, IOContext, IOResponse, Logger } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class Ifconfig extends ExternalClient {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  logger: Logger
  constructor(context: IOContext, options?: InstanceOptions) {
    const { authToken, logger } = context

    super('', context, {
      ...options,
      headers: {
        'X-Vtex-Use-Https': 'true',
        'Proxy-Authorization': authToken,
        // 'X-Vtex-Proxy-To': 'https://ifconfig.me'
      },
    })
    this.logger = logger
  }

  public async getExternalIp(): Promise<IOResponse<string>> {
    this.logger.info('Calling https://ifconfig.me server...')

    return this.http.getRaw('http://ifconfig.me')
  }
}
