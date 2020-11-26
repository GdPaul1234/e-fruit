<!-- d'après https://v3.vuejs.org/guide/transitions-state.html#organizing-transitions-into-components -->
<template>
  <span>{{ fullValue }}</span>
</template>

<script>
module.exports = {
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      tweeningValue: 0,
    };
  },
  computed: {
    fullValue() {
      return Number.parseFloat(this.tweeningValue).toFixed(2);
    },
  },
  methods: {
    tween(newValue, oldValue) {
      gsap.to(this.$data, {
        duration: 0.5,
        tweeningValue: newValue,
        ease: "sine",
      });
    },
  },
  watch: {
    value(newValue, oldValue) {
      this.tween(newValue, oldValue);
    },
  },
  mounted() {
    this.tween(this.value, 0);
  },
};
</script>

<style></style>
