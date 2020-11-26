<template>
  <div class="article-container">
    <article v-for="article in articles" :key="article.id">
      <img :src="article.image" />

      <div>
        <a class="title" :href="`/#/p/${article.id}`">
          <strong>{{ article.name }}</strong>
          {{ article.description }}
        </a>

        <div class="price">
          {{ Number.parseFloat(article.price).toFixed(2) }} € le kilo
        </div>
      </div>
    </article>
  </div>
</template>

<script>
module.exports = {
  props: {
    articles: { type: Array, default: [] },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
/*  article ------------------------------------------------------- */
.article-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, 236.25px);
  grid-gap: 1rem;
  justify-content: center;
  margin: 0 1rem;
}

article .title {
  height: 52.8px;
  overflow: hidden;

  font-size: 14px;
  margin-bottom: 1rem;
  line-height: 18px;

  display: block;
  text-decoration: none;
  color: black;
}

article .title:hover {
  text-decoration: underline;
}

article .price {
  font-size: 16px;
  font-weight: 700;
}

img {
  width: 216.25px;
  height: 216.25px;
  object-fit: contain;
  background-color: white;
}
</style>
