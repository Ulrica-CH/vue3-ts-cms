import formatUtctime from '@/utils/format-time'
import type { App } from 'vue'
export default function registerProperties(app: App) {
  app.config.globalProperties.$filters = {
    formatTime(value: string) {
      return formatUtctime(value)
    }
  }
}
