import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { type User } from 'src/util/Interface';

export const authStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null);
    const isAuthenticated = computed(() => {
      return user.value !== null;
    });


    function setUserData(data: User | null = null): void {
      user.value = data;
    }

    return {
      user,
      setUserData,
      isAuthenticated
    };
  },
  {
    persist: {
      pick: ['user'],
    },
  }
);
