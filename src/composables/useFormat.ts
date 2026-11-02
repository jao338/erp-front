import { type MoneyStyleType, type SizeType } from 'src/util/Interface';
import { useQuasar } from 'quasar';
import { ButtonSizeType, TextSizeType } from 'src/util/Enums';

import dayjs from 'dayjs';

export default function useFormat() {
  function formatSizes(type: SizeType = 'button'): string {
    const { screen } = useQuasar()

    switch (type) {
      case 'button':
        if (screen.gt.lg) return ButtonSizeType.Medium
        if (screen.gt.md) return ButtonSizeType.Medium
        return ButtonSizeType.Small

      case 'text':
        if (screen.gt.lg) return TextSizeType.TextH1
        if (screen.gt.md) return TextSizeType.TextH2
        if (screen.gt.sm) return TextSizeType.TextH3
        return TextSizeType.TextH5
    }
  }

  function formatCNPJ(cnpj: number|string|undefined): string {
    if(cnpj){
      const cnpjString = cnpj.toString().padStart(14, '0');
      return `${cnpjString.slice(0, 2)}.${cnpjString.slice(2, 5)}.${cnpjString.slice(5, 8)}/${cnpjString.slice(8, 12)}-${cnpjString.slice(12, 14)}`;
    }
    return ''
  }

  function formatPhone(phone: string|undefined): string {
    if (phone && phone.length === 12) {
      return `(${phone.slice(0, 3)})${phone.slice(3, 8)}-${phone.slice(8, 12)}`;
    }
    return '';
  }

  function formatCPF(cpf: string|undefined): string {
    if (cpf && cpf.length === 11) {
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
    }
    return '';
  }

  function formatDate(element: string|undefined): string {
    if (element) {
      return dayjs(element, 'YYYY-MM-DD').format('DD/MM/YYYY');
    }
    return '';
  }

  function formatCurrencyBR(element: number, style: MoneyStyleType = 'currency', decimals = 2): string {
    return new Intl.NumberFormat('pt-BR', {
      style,
      currency: 'BRL',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(element)
  }

  return {
    formatSizes,
    formatDate,
    formatCNPJ,
    formatPhone,
    formatCPF,
    formatCurrencyBR
  };
}
