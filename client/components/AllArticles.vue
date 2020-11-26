<template>
  <div>
    <h2>Correction de la reconnaissance du fruit</h2>
    <div class="search">
      <span>Rechercher</span>
      <input
        type="search"
        id="query"
        v-model="searchQuery"
        placeholder=" banane, pomme, poire..."
      />
    </div>

    <article-card :articles="searchArticles"></article-card>
  </div>
</template>

<script>
const ArticleCard = window.httpVueLoader("./components/card/ArticleCard.vue");

module.exports = {
  components: {
    ArticleCard,
  },
  props: {
    articles: { type: Array, default: [] },
  },
  data() {
    return {
      searchQuery: "",
    };
  },
  computed: {
    searchArticles() {
      var result = [];
      if (this.searchQuery !== "") {
        for (let index = 0; index < this.articles.length; index++) {
          const element = this.articles[index];
          const articleName = element.name.toLowerCase();
          const articleDesc = element.description.toLowerCase();
          const search = this.searchQuery.toLowerCase();
          if (articleName.includes(search) || articleDesc.includes(search)) {
            result.push(element);
          }
        }
      } else {
        result = this.articles;
      }

      return result;
    },
  },
};
</script>

<style scoped>
h2 {
  text-align: center;
  text-shadow: rgba(255, 255, 255, 0.5) 0px 0px 15px,
    rgba(255, 255, 255, 0.5) 0px 0px 10px;
}

/*  article ------------------------------------------------------- */
.article-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, 236.25px);
  grid-gap: 1rem;
  justify-content: center;
  margin: 0 1rem;
}

article {
  background-image: radial-gradient(
    circle farthest-corner at 10% 20%,
    rgba(234, 249, 249, 0.67) 0.1%,
    rgba(239, 249, 251, 0.63) 90.1%
  );
  border-radius: 10px;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
  padding: 10px;
}
</style>
