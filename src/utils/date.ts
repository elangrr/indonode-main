import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function displayDateToNow(date: string): string {
  return dayjs(date).fromNow()
}
