import type { IOContext, InstanceOptions } from '@vtex/api'
import { Apps, ExternalClient } from '@vtex/api'

import type { PutLogEventsRequest, LogEvent } from './cloudwatch.d'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const url = require('url')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const aws4 = require('aws4')
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const qs = require('qs')

export default class CloudWatchLogger extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    const { authToken } = context

    super(
      'https://logs.eu-central-1.amazonaws.com/?Action=PutLogEvents',
      context,
      {
        ...options,
        headers: {
          // ...options?.headers,
          'Content-Type': 'application/x-amz-json-1.1',
          'X-Vtex-Use-Https': 'true',
          'Proxy-Authorization': authToken,
        },
      }
    )
  }

  private async getMyAppSettings() {
    const apps = new Apps(this.context)
    const appId = process.env.VTEX_APP_ID as string

    // eslint-disable-next-line no-return-await
    return await apps.getAppSettings(appId)
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public async cwLogger(dataToLog: Object): Promise<any> {
    const { awsconfig } = await this.getMyAppSettings()
    const credentials = {
      accessKeyId: awsconfig.accesskeyid,
      secretAccessKey: awsconfig.secretaccesskey,
    }

    // eslint-disable-next-line new-cap
    const cwLogsUrl = new url.parse(
      'https://logs.eu-central-1.amazonaws.com/?Action=PutLogEvents'
    )

    const logEvent: LogEvent = {
      message: JSON.stringify(dataToLog),
      timestamp: Date.now(),
    }

    const eventToSend: PutLogEventsRequest = {
      logEvents: [logEvent],
      logGroupName: 'apps',
      logStreamName: 'poc',
    }

    const opts = {
      host: 'logs.eu-central-1.amazonaws.com',
      method: 'POST',
      url: cwLogsUrl.href,
      path: cwLogsUrl.path,
      body: JSON.stringify(eventToSend),
      data: JSON.stringify(eventToSend),
      headers: {
        'X-Amz-Target': 'Logs_20140328.PutLogEvents',
        'Content-Type': 'application/x-amz-json-1.1',
      },
    }

    aws4.sign(opts, credentials)

    // eslint-disable-next-line no-console
    console.log(opts)

    if (this.options?.baseURL) {
      this.options.baseURL = cwLogsUrl.href
    }

    if (this.options?.headers) {
      this.options.headers = {
        ...Object(opts.headers),
        'X-Vtex-Use-Https': this.options?.headers['X-Vtex-Use-Https'],
        'Proxy-Authorization': this.options?.headers['Proxy-Authorization'],
        'X-Vtex-Proxy-To': cwLogsUrl.href,
        'X-Amz-Target': 'Logs_20140328.PutLogEvents',
        'Content-Type': 'application/x-amz-json-1.1',
      }
    }

    // eslint-disable-next-line no-return-await
    return await this.http.post(cwLogsUrl.href, eventToSend, {
      headers: this.options?.headers,
    })
  }
}
