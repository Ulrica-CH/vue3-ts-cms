import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
dayjs.extend(utc)
export default function formatUtctime(
  utcTime: string,
  formatTime: string = DATE_TIME_FORMAT
) {
  return dayjs.utc(utcTime).format(formatTime)
}
