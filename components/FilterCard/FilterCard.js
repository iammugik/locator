import { mapMultiRowFields } from 'vuex-map-fields'

export default {
  computed: {
    ...mapMultiRowFields({ cards: 'cards' }),
    cardsWithImages() {
      return this.cards.filter(card => card.image)
    },
    cardsWithoutImages() {
      return this.cards.filter(card => !card.image)
    }
  }
}
