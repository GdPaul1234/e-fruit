<template>
  <div>
    <div class="table-container" v-if="isAdmin">
      <table :class="classTable">
        <colgroup>
          <col style="width: 200px" />
          <col style="width: 100%" />
          <col style="width: 150px" />
        </colgroup>
        <thead>
          <tr>
            <th>user_id</th>
            <th>e-mail</th>
            <th>admin?</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="id">{{ user.id }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.admin ? "Oui" : "Non" }}</td>
          </tr>
        </tbody>
      </table>

      <button style="float: right; margin-top: 0.5rem" @click="getUsers()">
        Actualiser
      </button>

      <register
        class="add-user"
        :rsuccess="rsuccess"
        :rerror="rerror"
        :rerror_reason="rerror_reason"
        @register-user="registerUser"
      >
      </register>
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
const Register = window.httpVueLoader("./components/user/Register.vue");

module.exports = {
  components: {
    Register,
  },
  props: {
    articles: { type: Array, default: [] },
    isAdmin: { type: Boolean },

    rsuccess: { type: Boolean, default: false },
    rerror: { type: Boolean, default: false },
    rerror_reason: { type: String },
  },
  data() {
    return {
      classTable: "articles-table",
      users: [],
    };
  },
  async mounted() {
    await this.getUsers();
    console.log("OK");
  },
  methods: {
    async getUsers() {
      var result = await axios.get("/api/all_users");
      this.users = result.data.users;
    },

    registerUser(newUser) {
      this.$emit("register-user", newUser);
      // refresh list of users after 1 s
      window.setTimeout(this.getUsers, 1000);
    },
  },
};
</script>

<style scoped>
.add-user {
  /* fixé en bas à droite */
  position: fixed;
  bottom: 1em;
  right: 2em;
}

ul {
  margin-block-start: 0.5em;
  margin-block-end: 1em;
  padding-inline-start: 20px;
}

li {
  display: flex;
  height: 18px;
  overflow: hidden;
  justify-content: space-between;
}

.table-container {
  overflow: auto;
  margin: 0 1rem;
  margin-bottom: 70px;
}

.articles-table {
  width: 100%;
  border-collapse: collapse;

  table-layout: fixed;
}
/* Zebra striping */
.articles-table tr:nth-of-type(odd) {
  background: rgba(238, 238, 238, 0.4);
}
.articles-table tr:nth-of-type(even) {
  background: rgba(238, 238, 238, 0.6);
}

.articles-table th {
  background: rgba(51, 51, 51, 0.8);
  color: white;
  font-weight: bold;
}

.articles-table td[scope="row"] {
  font-weight: bold;
}

.articles-table td,
th {
  padding: 6px;
  border: 1px solid #ccc;
  text-align: left;
}
.articles-table td > img,
.articles-mobile td > img {
  height: 50px;
  width: auto;
}

.articles-table .id {
  text-align: right;
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
