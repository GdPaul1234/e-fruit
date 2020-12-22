<template>
  <div>
    <div class="table-container" v-if="isAdmin">
      <table :class="classTable">
        <colgroup>
          <col style="width: 75px" />
          <col style="width: 200px" />
          <col style="width: 70%" />
          <col style="width: 30%" />
        </colgroup>
        <thead>
          <tr>
            <th>id</th>
            <th>Date</th>
            <th>Suggestions</th>
            <th>Poids</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pesee in pesees" :key="pesee.id">
            <td>{{ pesee.id }}</td>
            <td>{{ pesee.date }}</td>
            <td>
              <details>
                <summary>
                  <strong>{{ pesee.summary }}</strong>
                </summary>
                <ul>
                  <li
                    v-for="(suggestion, index) in pesee.suggestions"
                    :key="index"
                  >
                    <span>
                      {{ suggestion.categorie }}
                    </span>

                    <span class="score" :style="{ width: suggestion.score*250 + 'px' }">
                      {{
                        Number.parseFloat(suggestion.score * 100).toFixed(0)
                      }}
                      %
                    </span>
                  </li>
                </ul>
              </details>
            </td>
            <td>
              {{ Number.parseFloat(pesee.poids).toFixed(2) }} kg
            </td>
          </tr>
        </tbody>
      </table>

      <button style="float: right; margin-top: 0.5rem" @click="getPesees()">
        Actualiser
      </button>
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
    articles: { type: Array, default: [] },
    isAdmin: { type: Boolean },
  },
  data() {
    return {
      classTable: "articles-table",
      pesees: [],
    };
  },
  async mounted() {
    await this.getPesees();
    console.log("OK");
  },
  methods: {
    async getPesees() {
      var result = await axios.get("/api/pesees");
      this.pesees = result.data.pesees;

      for (var pesee of this.pesees) {
        // Transformer la date postgre en quelque chose de lisible pour des humains
        var date = new Date(pesee.date);
        pesee.date = date.toLocaleString();

        // parse le json des suggestions
        var suggestions = JSON.parse(pesee.suggestions);
        // mettre le fruit probable en summary et le reste des suggetions en détails
        pesee.summary = suggestions[0].categorie;
        pesee.suggestions = suggestions;
      }
    },
  },
};
</script>

<style scoped>
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

.articles-table .score {
  background-color: blue;
  color: white;
  padding: 0 5px;
  border-radius: 5px 0 0 5px;
  
  flex-shrink: 0;

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
