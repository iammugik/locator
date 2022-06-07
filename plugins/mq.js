import Vue from 'vue'; // eslint-disable-line
import VueMq from 'vue-mq'

Vue.use(VueMq, {
  defaultBreakpoint: 'default',
  breakpoints: {
    tablet: 768,
    screen: Infinity
  }
})
