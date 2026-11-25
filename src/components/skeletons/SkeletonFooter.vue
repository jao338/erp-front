<template>
  <q-footer>
    <q-toolbar>
      <div class="row items-center full-width q-pa-md">
        <div class="flex items-center col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12" :class="$q.screen.gt.xs ? 'justify-start' : 'justify-center q-mb-md'">
          <span class="q-mr-xs">{{ $t('developedBy') }}</span>
          <a
            class="link-footer"
            href="https://www.crmsolucoes.com.br/"
            target="_blank"
          >{{ $t('companyName') }}</a>
        </div>
        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 flex items-center" :class="$q.screen.gt.xs ? 'justify-end' : 'justify-center'">
          <a
            href="https://www.linkedin.com/in/jo%C3%A3o-henrique-799129267/"
            class="link-footer"
            target="_blank"
          >João Henrique</a>
          <span>. {{ $t('allRightsReserved') }} <span class="text-bold">{{ dayjs().format('YYYY') }}</span></span>
        </div>
      </div>
    </q-toolbar>
  </q-footer>

</template>

<script setup lang="ts">

import dayjs from 'dayjs';

defineOptions({
  name: 'SkeletonFooter',
});
</script>
