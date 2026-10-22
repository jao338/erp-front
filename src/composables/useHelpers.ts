import dayjs from 'dayjs';
import axios from 'axios';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { type Ref, ref } from 'vue';
import { type Pagination, type RequestErrors } from 'src/util/Interface';
import { type QTableColumn } from 'quasar';
import { FieldType } from 'src/util/Enums';
import * as XLSX from 'xlsx';

export default function useHelpers() {
  dayjs.extend(customParseFormat);

  const originalForm = ref<object>({});

  function mountUrl(url: string, form: object): string {
    const params = Object.entries(form)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    return `${url}?${params}`;
  }

  function deepCopy(obj: object): JSON {
    return JSON.parse(JSON.stringify(obj));
  }

  function getOriginalForm(): object {
    return originalForm.value;
  }

  function returnGridAlign(val: string): string {
    switch (val) {
      case 'center': return 'items-center';
      case 'right': return 'items-end';
      default: return 'items-start';
    }
  }

  function getRequestErrors(error: unknown): RequestErrors {
    if (!axios.isAxiosError(error)) {
      return {};
    }

    const requestErrors = error.response?.data?.errors;

    if (!requestErrors || typeof requestErrors !== 'object') {
      return {};
    }

    return requestErrors as RequestErrors;
  }

  function returnAbsoluteAlign(val: string): string {
    switch (val)
    {
      case 'top':
        return 'absolute-top';
      case 'bottom':
        return 'absolute-bottom';
      case 'left':
        return 'absolute-left';
      case 'right':
        return 'absolute-right';
      default:
        return '';
    }
  }

  function resetFormAdvancedSearch(form: Ref<object>): void {
    form.value = deepCopy(getOriginalForm());
  }

  async function resetForm(form: Ref<object>, callback: () => Promise<void>): Promise<void> {
    if(form.value){
      Object.assign(form.value, deepCopy(originalForm.value));
      await callback();
    }
  }

  function setOriginalForm(form: object): void {
    originalForm.value = deepCopy(form);
  }

  function hasError(
    errors: RequestErrors,
    field: string
  ): boolean {
    return Boolean(errors && errors[field] && errors[field][0]);
  }

  function getError(errors: RequestErrors, field: string): string
  {
    return errors[field]?.[0] ?? '';
  }

  function resetValidation(
    errors: RequestErrors,
    field: string
  ): void {
    delete errors[field];
  }

  function toggleLoading(loading: Ref<boolean>): void {
    loading.value = !loading.value;
  }

  function setPagination(
    pagination: Pagination,
    currentPage: number,
    perPage: number,
    total: number,
    sortBy?: string,
    descending?: boolean
  ): void {
    pagination.page = currentPage;
    pagination.rowsPerPage = perPage;
    pagination.rowsNumber = total;
    pagination.sortBy = sortBy ?? pagination.sortBy;
    pagination.descending = descending ?? pagination.descending;
  }

  async function fetchOptions<T>(
    loader: () => Promise<{ data: T[] }>,
    target: Ref<T[]>,
    loading: Ref<boolean>
  ): Promise<void> {
    try {
      toggleLoading(loading);
      const { data } = await loader();
      target.value = data;
    } finally {
      toggleLoading(loading);
    }
  }

  function getPagination(pagination: Pagination): Pagination {
    return {
      page: pagination.page ?? 1,
      sortBy: pagination.sortBy ?? '',
      descending: pagination.descending ?? false,
      rowsPerPage: pagination.rowsPerPage ?? 5,
      rowsNumber: pagination.rowsNumber ?? 0,
    }
  }

  function getInputType(val: unknown): FieldType {
    if (typeof val === 'string') return FieldType.TextField;
    if (Array.isArray(val)) return FieldType.SelectField;
    if (typeof val === 'object' && val !== null) return FieldType.ObjectField;
    return FieldType.Unknown;
  }

  function transformToFormData(element: any, parentKey = ''): FormData {
    const formData = new FormData()

    function appendData(obj: any, parentKey: string) {
      for (const key in obj) {
        if (obj[key] !== null && obj[key] !== undefined) {
          const fieldKey = parentKey ? `${parentKey}[${key}]` : key

          if (obj[key] instanceof Array) {
            obj[key].forEach((value: any, index: number) => {
              if (value !== null && value !== undefined) {
                formData.append(`${fieldKey}[${index}]`, value)
              }
            })
          } else if (obj[key] instanceof Object && !(obj[key] instanceof File)) {
            appendData(obj[key], fieldKey)
          } else {
            formData.append(fieldKey, obj[key])
          }
        }
      }
    }

    appendData(element, parentKey)
    return formData
  }

  function calculatePasswordStrength(password: string): number {
    let strength = 0

    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 15
    if (/[a-z]/.test(password)) strength += 15
    if (/[0-9]/.test(password)) strength += 15
    if (/[^a-zA-Z0-9]/.test(password)) strength += 30

    return strength > 100 ? 100 : strength
  }

  function linkDownload(base64: string, nome_arquivo: string, tipo = 'json'): void {
    const link = document.createElement('a')
    link.href = `data:${tipo};base64,${base64}`

    link.download = nome_arquivo
    document.body.appendChild(link)

    link.click()
    document.body.removeChild(link)
  }

  function generateCPF(): string {
    const randomNumbers = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))

    const calculateVerifier = (baseNumbers: any) => {
      const weight = baseNumbers.length + 1
      const sum = baseNumbers.reduce(
        (acc: number, num: number, index: number) => acc + num * (weight - index),
        0,
      )
      const remainder = sum % 11
      return remainder < 2 ? 0 : 11 - remainder
    }

    const firstVerifier = calculateVerifier(randomNumbers)

    const secondVerifier = calculateVerifier([...randomNumbers, firstVerifier])

    const cpf = [...randomNumbers, firstVerifier, secondVerifier].join('')

    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  function applyMask(value: string, mask: string): string {
    const maskCharacters: { [key: string]: RegExp } = {
      '#': /\d/, // Apenas números
      A: /[A-Z]/, // Apenas letras maiúsculas
      a: /[a-z]/, // Apenas letras minúsculas
      X: /[A-Za-z]/, // Letras maiúsculas ou minúsculas
      S: /\w/, // Letras ou números
      '!': /./, // Qualquer caractere
    }

    let maskedValue = ''
    let valueIndex = 0

    for (let i = 0; i < mask.length; i++) {
      const maskChar: any = mask[i]
      const valueChar: string | undefined = value[valueIndex]

      if (!valueChar) break

      if (maskCharacters[maskChar]) {
        if (maskCharacters[maskChar].test(valueChar)) {
          maskedValue += valueChar
          valueIndex++
        }
      } else {
        maskedValue += maskChar
        if (valueChar === maskChar) {
          valueIndex++
        }
      }
    }

    return maskedValue
  }

  function removeMask(value: string): string {
    return value.replace(/\D/g, '')
  }

  function exportToExcel(rows: any, columns: QTableColumn[], fileName: string = 'tabela'): void {
    if (rows.length === 0 || columns.length === 0) return

    const filteredColumns = columns.filter((col) => col.name !== 'actions')

    const data = rows.map((row: any) =>
      filteredColumns.reduce((acc: Record<string, any>, col: Record<string, any>) => {
        acc[col.label] = row[col.field]
        return acc
      }, {}),
    )

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Dados')

    XLSX.writeFile(wb, `${fileName}.xlsx`)
  }

  function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return {
    getError,
    getPagination,
    getInputType,
    setPagination,
    setOriginalForm,
    resetValidation,
    resetFormAdvancedSearch,
    resetForm,
    returnAbsoluteAlign,
    returnGridAlign,
    mountUrl,
    hasError,
    toggleLoading,
    fetchOptions,
    transformToFormData,
    calculatePasswordStrength,
    getRandomColor,
    getRequestErrors,
    linkDownload,
    generateCPF,
    applyMask,
    removeMask,
    exportToExcel
  };
}
