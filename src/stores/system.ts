import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { Lang } from 'src/util/Enums';

import { i18n } from 'boot/i18n';

export const systemStore = defineStore(
  'system',
  () => {
    const darkMode       = ref<boolean>(false);
    const menuOpen       = ref<boolean>(false);
    const language       = ref<Lang>(Lang.Portuguese);
    const $q             = useQuasar();
    const temporaryEmail = ref<string>('');

    function toggleDarkMode(): void {
      darkMode.value = !darkMode.value;
      setDarkMode();
    }

    function toggleMenu(): void {
      menuOpen.value = !menuOpen.value;
    }

    function setLanguage(lang: Lang): void {
      language.value = lang;
      i18n.global.locale.value = lang;
    }

    function setTemporaryEmail(email: string): void {
      temporaryEmail.value = email;
    }

    function setDarkMode(): void {
      $q.dark.set(darkMode.value);
    }

    return {
      darkMode,
      menuOpen,
      language,
      temporaryEmail,
      toggleDarkMode,
      toggleMenu,
      setDarkMode,
      setTemporaryEmail,
      setLanguage
    };
  },
  {
    persist: {
      pick: ['darkMode', 'language'],
    },
  }
);
