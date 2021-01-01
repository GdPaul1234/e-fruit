<template>
  <transition-group
    class="recipe-container"
    name="list"
    tag="div"
    :css="false"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <article
      class="article"
      v-for="(recipe, index) in recipes"
      :key="recipe.id + recipe.title"
      :data-index="index"
    >
      <a :href="`https://fr.wikibooks.org/wiki/${recipe.link}`">
        <span>{{ recipe.title }}</span>
      </a>
      <span class="categorie" v-if="recipe.categorie !== ''">
        {{ recipe.categorie }}
      </span>
    </article>
  </transition-group>
</template>

<script>
module.exports = {
  props: {
    fruit: { type: String, required: true },
  },
  data() {
    return {
      recipes: [],
    };
  },
  watch: {
    fruit: {
      immediate: true,
      handler: "getSuggestions",
    },
  },
  methods: {
    async getSuggestions() {
      // fetch data depuis api search de wikilivres
      // origin=* important pour les non-authenticated requests pour éviter des erreurs cors
      const res1 = await axios.get(
        "http://fr.wikibooks.org/w/api.php?action=query" +
          "&list=search&srsearch=" +
          encodeURIComponent(
            `${this.fruit.replace(/ .*/, "")} intitle:"Livre de cuisine/"`
          ) +
          "&origin=*" +
          "&utf8=&format=json"
      );
      var result = res1.data.query.search;
      this.recipes = [];

      for (let index = 0; index < result.length; index++) {
        const title = result[index]["title"]; // title de l'article retourné pae l'API search de mediawiki
        var chapitres = title.split("/"); // extraction des catégories de la recette
        const recipeName = chapitres.pop(); // Le nom de la recette est le dernier élément du chapitre
        const categorie = await this.getCategorie(title); // catégorie de la recette avec une requête récupérant ces infos

        if (
          recipeName !== "Ingrédients" &&
          !recipeName.includes("Liste") &&
          !recipeName.includes("Recettes")
        ) {
          var recipe = {
            title: recipeName,
            link: title,
            categorie: categorie,
            id: index,
          };
          this.recipes.push(recipe);
        }
      }
    },

    async getCategorie(link) {
      // fetch categories des pages
      //console.log("Recherche catégorie de "+link+"\n==========")
      const res = await axios.get(
        "http://fr.wikibooks.org/w/api.php?action=query" +
          "&prop=categories" +
          "&titles=" +
          encodeURIComponent(link) +
          "&cllimit=100" +
          "&origin=*" +
          "&utf8=&format=json"
      );
      var result = res.data.query.pages;
      var categories = result[Object.keys(result)[0]].categories;
      var categorie = categories[0].title.replace("Catégorie:", "");

      // Afficher la catégorie suivante si elle n'est pas interessante
      var i = 1;
      while (
        (categorie.includes("livre") ||
          categorie.includes("à base") ||
          categorie.includes("Cuisine") ||
          categorie.includes("Recettes") ||
          categorie.includes("Catégorie") ||
          categorie.includes("Page")) &&
        i < categories.length
      ) {
        categorie = categories[i].title.replace("Catégorie:", "");
        //console.log(categorie);
        i++;
      }

      //console.log("\nCatégorie choisie: "+categorie+"\n ");

      return categorie;
    },

    /**
     * TRANSITIONS using gsap
     * https://v3.vuejs.org/guide/transitions-list.html#staggering-list-transitions
     * */
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.height = "auto";
    },
    enter(el, done) {
      gsap.to(el, {
        opacity: 1,
        height: "auto",
        delay: el.dataset.index * 0,
        onComplete: done,
      });
    },
    leave(el, done) {
      gsap.to(el, {
        opacity: 0,
        height: 0,
        delay: el.dataset.index * 0,
        onComplete: done,
      });
    },
  },
};
</script>

<style scoped>
.recipe-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.recipe-container article {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
}

.categorie {
  padding: 0.25rem;
  border-radius: 0.5rem;
  background-color: #f1f1f1;
}

/* List transition */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
