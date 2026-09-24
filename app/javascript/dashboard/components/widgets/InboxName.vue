<script setup>
import { computed } from 'vue';
import ChannelIcon from 'dashboard/components-next/icon/ChannelIcon.vue';

const props = defineProps({
  inbox: {
    type: Object,
    default: () => {},
  },
});

const displayName = computed(() =>
  (props.inbox.name || '').replace(/\s*\[.*?\]\s*/g, '').trim()
);
</script>

<template>
  <div :title="displayName" class="flex items-center gap-0.5 min-w-0">
    <ChannelIcon :inbox="inbox" class="size-4 flex-shrink-0 text-n-slate-11" />
    <span class="truncate text-label-small text-n-slate-11">
      {{ displayName }}
    </span>
  </div>
</template>
