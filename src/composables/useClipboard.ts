import { useI18n } from 'vue-i18n';
import useNotify from './useNotify';

export function useClipboard() {
  const { successMessage, errorMessage } = useNotify()
  const { t } = useI18n()

  async function copyToClipboard(value: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value)
      successMessage(t('textCopied'))
    } catch {
      errorMessage(t('copyError'))
    }
  }

  return {
    copyToClipboard,
  }
}
