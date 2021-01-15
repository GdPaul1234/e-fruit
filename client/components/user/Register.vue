<template>
  <div>
    <!-- Gestion des erreurs -->
    <div class="error" v-if="rerror">{{ rerror_reason }}</div>
    <div class="success" v-if="rsuccess">
      Utilisateur enregistré avec succès !
    </div>

    <!-- Formulaire d'inscription -->
    <form class="register" @submit.prevent="registerUser">
      <div class="field email">
        <label for="email">e-mail</label>
        <input
          type="email"
          v-model="newUser.email"
          placeholder="jonh.doe@example.com"
          required
        />
      </div>

      <div class="field password">
        <label for="password">mdp</label>
        <input
          type="password"
          v-model="newUser.password"
          placeholder="********"
          required
        />
      </div>

      <div class="button">
        <button type="submit">Ajouter</button>
      </div>
    </form>
  </div>
</template>

<script>
module.exports = {
  props: {
    rsuccess: { type: Boolean, default: false },
    rerror: { type: Boolean, default: false },
    rerror_reason: { type: String },
  },
  data() {
    return {
      newUser: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    registerUser() {
      this.$emit("register-user", this.newUser);
    },
  },
};
</script>

<style scoped>
h2 {
  text-align: center;
}

.error {
  background-color: #ffdddd;
  border-left: 6px solid #f44336;
  padding: 5px;
  margin: 0 auto 20px auto;
}

.success {
  background-color: #e7f3fe;
  border-left: 6px solid #2196f3;
  padding: 5px;
  margin: 0 auto 20px auto;
}

/* STYLE FORMULAIRE =========================================== */
.register {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  grid-template-rows: 1fr;
  gap: 0.5em 0.5em;
  grid-template-areas: "email password button-login";

  margin: 0 auto;
  padding: 0.5rem;

  border: 1px solid #ccc;
  border-radius: 1em;
  background-image: radial-gradient(
    circle farthest-corner at 10% 20%,
    rgba(234, 249, 249, 0.67) 0.1%,
    rgba(239, 249, 251, 0.63) 90.1%
  );
}

.email {
  grid-area: email;
}
.password {
  grid-area: password;
}
.button-login {
  grid-area: button-login;
}

.field {
  display: flex;
}

.field input {
  /* Pour harmoniser le look & feel des bordures des champs texte */
  border: 1px solid #999;
  width: 69%;
  padding: 0.25rem;
}

.login input:focus {
  /* Pour souligner légèrement les éléments actifs */
  border-color: #000;
}

.field label {
  display: inline-block;
  width: 30%;
  padding: 0.25rem;
  text-align: right;
}

/* STYLE BOUTON =============================================== */
button {
  border-top: 1px solid #97f7cc;
  background: #65d690;
  background: linear-gradient(top, #3e9c40, #65d690);
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 1) 0 1px 0;
  padding: 0.25rem;
  height: 100%;
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
</style>
