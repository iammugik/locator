<template lang="pug">
#express-card.logo.box
  h1.logo__image
    img(src="images/logo.png", alt="Logo Express Card")
  .logo__content Помощь на АЗС 24 часа
    br
    a.logo__phone(href="tel:+78007771497") +7 (800) 777-14-97
</template>
<style lang="scss">
.logo {
  position: relative;
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem 0.5rem;
  box-shadow: none;
  border-bottom: 1px solid #ccc;
  border-radius: 0;
  margin-bottom: 0 !important;

  @media screen and (max-width: 1024px) {
    font-size: 0.8em;
    padding-top: 1em;
    padding-bottom: 0.5em;

    h1 {
      width: 110px;
    }
  }

  &__phone {
    font-size: 1.1em;
    font-weight: 600;
  }

  &__image {
    margin-right: 15px;
  }
}
</style>
