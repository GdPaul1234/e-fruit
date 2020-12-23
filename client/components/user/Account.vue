<template>
  <div class="container">
    <div v-if="connectedUser !== ''">
      <fieldset>
        <legend>Gestion du compte</legend>
        <article class="article grid-disconnect">
          <button class="left" @click="logoutUser()">Deconnexion</button>
          <div class="right">
            <h3>Bonjour {{ connectedUser }}</h3>
            Cliquer sur ce bouton pour vous déconnecter.
          </div>
        </article>
      </fieldset>
    </div>

    <!-- Accès interdit -->
    <div class="forbidden" v-else>
      <img
        src="https://icons.iconarchive.com/icons/custom-icon-design/flatastic-5/256/Couple-icon.png"
        alt="couple"
      />
      <div class="content">
        <p>
          Vous êtes perdu !<br />
          <a href="/#/">Revenir à l'accueil</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    connectedUser: { type: String },
    isAdmin: { type: Boolean },
  },
  data() {
    return {};
  },
  methods: {
    logoutUser() {
      this.$emit("logout-user");
    },
  },
};
</script>

<style scoped>
h2 {
  text-align: center;
}

legend {
  background-color: #000;
  color: #fff;
  padding: 3px 6px;
}

fieldset {
  margin-bottom: 1.5rem;
}

.grid-disconnect {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0 1rem;
}

.grid-disconnect .left {
  grid-column: 1 / 2;
}

.grid-disconnect .right {
  grid-column: 2 / 3;
}

.right h3 {
  margin-top: 0;
  margin-bottom: 0.5em;
}

/* ACCES INTERDIT ======================================== */
.forbidden {
  margin: 0 auto 20px auto;
  padding: 1rem;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 1em;
  background-image: radial-gradient(
    circle farthest-corner at 10% 20%,
    rgba(234, 249, 249, 0.67) 0.1%,
    rgba(239, 249, 251, 0.63) 90.1%
  );
  display: flex;
  align-items: center;
}

.forbidden img {
  height: 100%;
  max-height: 72px;
  width: auto;
  padding-right: 0.5em;
}

.forbidden .content {
  border-left: 1px solid darkgray;
  padding-left: 0.5em;
}
</style>
