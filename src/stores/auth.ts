import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { type UserResponse } from 'src/util/Interface';

export const authStore = defineStore(
  'auth',
  () => {
    const user = ref<UserResponse | null>(null);
    const isAuthenticated = computed(() => {
      return user.value !== null;
    });


    function setUserData(data: UserResponse | null = null): void {
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
