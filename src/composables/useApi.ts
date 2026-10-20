import { api } from 'boot/axios.js';
import { useI18n } from 'vue-i18n';
import useHelpers from 'src/composables/useHelpers';
import useNotify from 'src/composables/useNotify';

import { type Meta } from 'src/util/Interface';

export default function useApi(url = '') {
  const { successMessage, errorMessage } = useNotify()
  const { mountUrl } = useHelpers()
  const { t } = useI18n()

  async function index<T>(form = {}): Promise<{ data: Array<T>, meta: Meta }> {
    const { data } = await api.get(mountUrl(url, form));
    return { data: data?.data as Array<T>, meta: data?.meta as Meta };
  }

  async function show<T>(uuid: string | null): Promise<{ data: T }> {
    const { data } = await api.get(`${url}/${uuid}`);

    return { data: data?.data as T };
  }

  async function create<T>(form = {}, returnSucessMessage = true): Promise<{ data: T }> {
    const { data } = await api.post(url, form);

    if (returnSucessMessage) successMessage(t('criadoSucesso'));

    return { data: (data?.data ?? data) as T };
  }

  async function update(
    uuid: string,
    form: object,
    returnSucessMessage = true,
  ): Promise<void> {
    await api.put(`${url}/${uuid}`, form);

    if (returnSucessMessage) successMessage(t('editadoSucesso'));
  }

  async function destroy(uuid: string, returnSucessMessage = true): Promise<void> {
    try {
      await api.delete(`${url}/${uuid}`);

      if (returnSucessMessage) successMessage(t('excluidoSucesso'));
    } catch {
      errorMessage(t('registroNaoPodeSerExcluido'));
    }
  }

  return {
    index,
    show,
    create,
    update,
    destroy,
  }
}
