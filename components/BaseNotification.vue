<template lang="pug">
.notificationList
  .notification.is-small(
    v-for="(noti, index) in notifications", :class="{ 'is-danger': noti.type=='error', 'is-success': noti.type=='success', 'is-info': noti.type=='info' }")
    | {{ noti.text }}
</template>

<script>
export default {
  computed: {
    notifications() {
      return this.$store.state.notifications
    }
  }
}
</script>

<style lang="scss">
.notificationList {
  position: fixed;
  bottom: 0;
  left: 10px;
  z-index: 3;
}

.notification.is-small {
  padding: 0.85rem;
  font-size: 0.8rem;
  margin-bottom: 10px;
}
</style>
