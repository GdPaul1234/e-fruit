<template>
  <div class="article-container">
    <article class="article" v-for="article in articlesSuggestion" :key="article.id">
      <img :src="article.image" />

      <div>
        <a class="title" :href="`/#/p/${article.id}`">
          <strong>{{ article.name }}</strong>
        </a>

        <div class="price">
          <strong>{{ article.price }} €</strong> - ({{ Number.parseFloat(article.score * 100).toFixed(0) }} %)
        </div>
      </div>
    </article>
  </div>
</template>

<script>
module.exports = {
  props: {
    articles: { type: Array, default: [] },
    suggestions: { type: Array, default: [] },
  },
  watch: {
    suggestions: {
      immediate: true,
      deep: true,
      handler: 'getDetailledSuggestions'
    }
  },
  data() {
    return {
      articlesSuggestion: [],
    };
  },
  methods: {
    getDetailledSuggestions(data) {
      this.articlesSuggestion = [];
      console.log(data);

      for (let index = 1; index < data.length; index++) {
        const item = data[index];
        console.log('item',item.categorie);
        
        var suggestion = this.articles.find((a) =>
            a.name.toUpperCase().includes(item.categorie.toUpperCase())
          );
        suggestion.score = item.score;
        this.articlesSuggestion.push(suggestion);
      }
    }
  }
};
</script>

<style scoped>
/*  article ------------------------------------------------------- */
.article-container {
  display: flex;
  overflow: auto;
}

.article {
  width: 150px;
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
}

img {
  width: 130px;
  height: 130px;
  object-fit: contain;
}
</style>