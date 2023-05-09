import { IOClients } from '@vtex/api'

import Ifconfig from './ifconfig'
import CloudWatchLogger from './cloudwatch'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get ifconfig() {
    return this.getOrSet('ifconfig', Ifconfig)
  }

  public get cwlogger() {
    return this.getOrSet('cwlogger', CloudWatchLogger)
  }
}
