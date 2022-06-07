<template lang="pug">
main
  PopupFilterCard(v-if="isShowCardsPopup")
  SectionMap(v-if="!isShowCardsPopup")
  BaseNotification()
</template>
<script>
import SectionMap from '@/components/SectionMap'
import BaseNotification from '@/components/BaseNotification'
import PopupFilterCard from '@/components/PopupFilterCard'

export default {
  components: {
    SectionMap,
    BaseNotification,
    PopupFilterCard
  },
  data() {
    return {
      map: null
    }
  },
  computed: {
    isShowCardsPopup() {
      return this.$store.state.isShowCardsPopup
    }
  },
  watch: {
    $route(to) {
      this.checkQuery(to)
    }
  },
  async mounted() {
    await this.$store.dispatch('getCards')
    this.checkQuery(this.$route)
  },
  methods: {
    checkQuery(to) {
      if (to.query.hasOwnProperty('card') && to.query.hasOwnProperty('index')) {
        this.$store.commit('setCardsValue', to.query.card)
        this.$store.commit('setIsShowCardsPopup', false)
        this.$store.commit('setCardsIndexTrue', parseInt(to.query.index))
        this.$router.push('/')
      }
    }
  }
}
</script>
<style lang="scss">
.sectionNotification__switch {
  position: absolute;
  top: 0;
  right: 400px;
  transform: translate(-10px, 0);
  z-index: 5;
  border: 0;
  background: transparent;
  box-shadow: none;
  padding: 0.5rem;
  margin: 0;
  cursor: pointer;
  transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.5rem;
  line-height: 1rem;

  @media screen and (max-width: 1024px) {
    display: none;
  }

  &:hover {
    opacity: 0.8;
  }
}

.sectionNotification__scroll {
  position: absolute;
  top: -60px;
  right: 18px;
  transform: translate(50%, 0);
  z-index: 5;
  border: 0;
  background: transparent;
  box-shadow: none;
  padding: 0.5rem;
  margin: 0;
  cursor: pointer;
  transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.5rem;
  line-height: 1rem;
}
</style>
