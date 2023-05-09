export interface CreateLogGroupRequest {
  logGroupName: string
  tags?: LogGroupTags
  kmsKeyId?: string
}
export interface LogGroupTags {
  string: string
}
export interface CreateLogStreamRequest {
  logGroupName: string
  logStreamName: string
}
export interface PutLogEventsRequest {
  logEvents: LogEvent[]
  logGroupName: string
  logStreamName: string
  sequenceToken?: string
}
export interface LogEvent {
  message: string
  timestamp: number
}
