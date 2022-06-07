<template lang="pug">
.popupFilterCard
  h2.popupFilterCard__title.title.is-1 Выберите вашу топливную карту
  .popupFilterCard__wrapper
    n-link.buttonFilterCard(
      v-for="(card, index) in cards",
      :key="card.id",
      v-if="card.isMain",
      :to="{ query: { card: card.id, index: index }}"
    )
      img.buttonFilterCard__image(
        :src="`https://locator.expcard.ru/azs/media/${card.image}`",
        :alt="card.name"
      )
      span.buttonFilterCard__title {{ card.name.split(', ')[0] }},
        span.buttonFilterCard__title-red &nbsp;{{ card.name.split(', ')[1] }}
</template>

<script>
import { mapMultiRowFields } from 'vuex-map-fields'

export default {
  computed: {
    ...mapMultiRowFields({ cards: 'cards' })
  }
}
</script>

<style lang="scss">
.popupFilterCard {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  padding: 0 120px;
  z-index: 999;
  background-color: #fff;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 1024px) {
    padding: 0 20px;
  }

  &__title.title {
    text-align: center;
    margin-bottom: 60px;
    margin-top: 30px;

    @media screen and (max-width: 1024px) {
      font-size: 32px;
    }
  }
}

.popupFilterCard__wrapper {
  width: 1100px;
  display: flex;

  @media screen and (max-width: 1200px) {
    width: 100%;
  }

  @media screen and (max-width: 620px) {
      flex-flow: column;
  }
}

.buttonFilterCard {
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity .4s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;

  &:hover {
    opacity: 1;
  }

  &__title {
    padding: 10px 0;
    display: block;
  }

  &__title-red {
    color: #e5550d;
  }
}
</style>
