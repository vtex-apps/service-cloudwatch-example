export async function getExternalIp(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { ifconfig, cwlogger },
    vtex: { logger },
  } = ctx

  console.info('Received request to get external IP...')
  logger.info('Received request to get external IP...')

  const ifconfigResponse = await ifconfig.getExternalIp()

  // const ifconfigResponsStringified = JSON.stringify(ifconfigResponse, null, 2)

  // console.info('ifconfig.me response:\n', ifconfigResponsStringified)

  const { headers, data } = ifconfigResponse

  console.info('ifconfig.me headers', headers)
  console.info('ifconfig.me data:', data)
  logger.info(`ifconfig.me data: ${data}`)
  const response = await cwlogger.cwLogger(data)

  // eslint-disable-next-line no-console
  console.log(response)

  ctx.status = ifconfigResponse.status
  ctx.body = data

  await next()
}
