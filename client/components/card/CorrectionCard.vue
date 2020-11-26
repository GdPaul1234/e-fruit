<template>
  <div class="article-container">
    <article class="article" v-for="article in articles" :key="article.id">
      <img :src="article.image" />

      <div>
        <a class="title" :href="`/#/p/${article.id}`">
          <strong>{{ article.name }}</strong>
        </a>

        <div class="price">
          {{ article.price }} €
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
  display: flex;
  overflow: auto;
}

article .title {
  height: 16px;
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
  width: 130px;
  height: 130px;
  object-fit: contain;
}
</style>