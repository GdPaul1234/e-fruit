<template>
  <div>
    <!-- Bouton pour accéder à l'accueil administrateur -->
    <div class="admin-button">
      <a href="/#/settings">Espace collaborateur</a>
    </div>

    <!-- Interface balance -->
    <div class="grid-container">
      <article class="article-balance">
        <div
          class="image"
          :style="`background-image: url(${article.image}) ;`"
        ></div>
        <div class="information">
          <h1 class="nom">{{ article.name }}</h1>
          <div class="description">
            <h3>{{ article.price }} € le kilo</h3>
            <p>{{ article.description }}</p>
          </div>
        </div>

        <div class="balance">
          <div class="prix">
            <animated-number :value="prixBalance"></animated-number> €
          </div>
          <div class="poids">
            <animated-number :value="poids"></animated-number> kg
          </div>
        </div>
      </article>

      <article class="correction">
        <h3>Une erreur de reconaissance du fruit sur la balance ?</h3>
        <div class="correction-articles">
          <correction-card :articles="articles" :suggestions="suggestions"></correction-card>
          <button class="bouton-search" @click="goToAllArticles()">
            Rechercher
          </button>
        </div>
      </article>

      <div class="recettes">
        <h3>Des recettes qui peuvent vous intéresser</h3>
        <recipe-card :fruit="article.name"></recipe-card>
      </div>

      <div class="consigne">Poser un fruit sur la balance et récupérer votre ticket de caisse</div>
    </div>
  </div>
</template>

<script>
const CorrectionCard = window.httpVueLoader(
  "./components/card/CorrectionCard.vue"
);
const RecipeCard = window.httpVueLoader("./components/card/RecipeCard.vue");
const AnimatedNumber = window.httpVueLoader(
  "./components/card/AnimatedNumber.vue"
);

module.exports = {
  components: {
    RecipeCard,
    CorrectionCard,
    AnimatedNumber,
  },
  props: {
    articles: { type: Array, default: [] },
    article: { type: Object, default: {} },
    suggestions: { type: Array, default: [] },
  },
  computed: {
    prixBalance() {
      return this.article.price * this.poids;
    },
  },
  data() {
    return {
      poids: 2.3,
    };
  },
  methods: {
    goToAllArticles() {
      // changer l'URL de la page courante
      this.$router.push({ path: "/correct_suggestion" });
    },
  },
};
</script>

<style scoped>
.admin-button {
  position: fixed;
  top: 0;
  right: 0;

  /* faire ressembler la div à un bouton */
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: rgb(241, 241, 241);
  z-index: 1000;

  /* décaler le bouton admin vers la droite pour le cacher */
  transform: translateX(160px);
  overflow: hidden;

  transition: all 0.5s ease-out;
}

.admin-button:hover {
  /* remettre le bouton à sa place pour le rendre plus visible */
  transform: translateX(0px);
  transition: all 0.5s ease-out;
}

/* VISUEL https://grid.layoutit.com?id=fery2E3 */
.grid-container {
  display: grid;
  grid-template-columns: 75% 1fr;
  grid-template-rows: 1fr auto auto;
  gap: 1em 1em;
  grid-template-areas:
    "article-balance recettes"
    "correction recettes"
    "consigne recettes";
}

.article-balance {
  display: grid;
  grid-template-columns: 30% 1fr;
  grid-template-rows: auto auto;
  gap: 0.5em 0.5em;
  grid-template-areas:
    "image information"
    "image balance";
  grid-area: article-balance;
}

.image {
  grid-area: image;
  /* https://code-boxx.com/keep-image-aspect-ratio/ */
  width: 100%;
  padding-bottom: 75%; /* 4:3 ratio = 3 / 4 = 0.75 */
  background-repeat: no-repeat;
  background-size: contain;

  background-color: white;
  background-position: center;
  border-radius: 1rem;
}

.information {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  gap: 0px 0px;
  grid-template-areas:
    "nom"
    "description";
  grid-area: information;

  padding: 0 1rem;
  background-image: radial-gradient(
    circle farthest-corner at 10% 20%,
    rgba(234, 249, 249, 0.67) 0.1%,
    rgba(239, 249, 251, 0.63) 90.1%
  );
  border-radius: 1rem;
}

.nom {
  grid-area: nom;
}

.description {
  grid-area: description;
}

.description h3 {
  margin-top: 0;
}

.balance {
  display: grid;
  grid-template-columns: 30% 1fr;
  grid-template-rows: 1fr;
  gap: 0px 0px;
  grid-template-areas: "prix poids";
  grid-area: balance;

  padding: 0 1rem;
  background-image: radial-gradient(
    circle farthest-corner at 10% 20%,
    rgba(243, 252, 127, 0.67) 0.1%,
    rgba(250, 250, 120, 0.63) 90.1%
  );
  border-radius: 1rem;
}

.prix {
  grid-area: prix;
  font-size: clamp(1.5rem, 2.5vw, 4rem);
  padding: 0.5em;
}

.poids {
  grid-area: poids;
  font-size: clamp(1.5rem, 2.5vw, 4rem);
  padding: 0.5em;
}

.recettes {
  grid-area: recettes;
  overflow: hidden;
}

.consigne {
  grid-area: consigne;

  padding: 1rem;
  background-image: radial-gradient(
    circle farthest-corner at 10% 20%,
    rgba(252, 127, 127, 0.67) 0.1%,
    rgba(250, 120, 120, 0.63) 90.1%
  );
  border-radius: 1rem;

  overflow: auto;
}

.correction-articles {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* STYLISATION element à l'intérieur des cellules */

button {
  border-top: 1px solid #97f7cc;
  background: #65d690;
  background: linear-gradient(top, #3e9c40, #65d690);
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 1) 0 1px 0;
  text-shadow: rgba(0, 0, 0, 0.4) 0 1px 0;
  color: white;
  font-size: 18px;
}
button:hover {
  border-top-color: #28783d;
  background: #28783d;
  color: #ccc;
}
button:active {
  border-top-color: #275c1b;
  background: #275c1b;
}

.correction h3,
.recettes h3 {
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5),
    0 0 10px rgba(255, 255, 255, 0.5);
  margin-top: 0;
}
</style>
