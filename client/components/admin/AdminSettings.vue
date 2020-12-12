<template>
  <div>
    <div class="grid-wrapper">
      <!-- Aperçu caméra -->
      <fieldset class="left">
        <legend>Aperçu caméra</legend>
        <video
          autoplay="true"
          id="videoElement"
          :src-object.prop.camel="stream"
        >
          Video stream not available.
        </video>
        <button @click="requestCameraPreview()">Obtenir aperçu caméra</button>
      </fieldset>

      <!-- Information appareil et connexion -->
      <fieldset class="right">
        <legend>Informations balance</legend>

        <div class="article">
          <h3>Caméra fruit</h3>
          <table class="infos-table">
            <tr v-for="(value, name, index) in videoTrack" :key="index">
              <td scope="row">{{ name }}</td>
              <td>{{ value }}</td>
            </tr>
          </table>

          <h3>Caméra poids</h3>
          <p>Not available :(</p>

          <h3>Connectivité</h3>
        </div>
      </fieldset>
    </div>

    <fieldset>
      <legend>Connexion</legend>
      <login
        :lsuccess="lsuccess"
        :lerror="lerror"
        :lerror_reason="lerror_reason"
        :is-admin="isAdmin"
        @login-user="loginUser"
      ></login>
    </fieldset>
  </div>
</template>

<script>
const Login = window.httpVueLoader("./components/user/Login.vue");

module.exports = {
  components: {
    Login,
  },
  props: {
    lsuccess: { type: Boolean, default: false },
    lerror: { type: Boolean, default: false },
    lerror_reason: { type: String },
    isAdmin: { type: Boolean, default: false },
    stream: {},
  },
  data() {
    return {
      videoTrack: {},
    };
  },
  watch: {
    stream: {
      immediate: true,
      deep: true,
      handler: "getCameraInfos",
    },
  },
  methods: {
    async loginUser(user) {
      await this.$emit("login-user", user);

      // Si l'utilisateur est un admin, le rediriger vers la page d'administration
      if(this.isAdmin) {
        this.$router.push({ path: "/correct_suggestion" }); // pour l'instant, je met un chemin bidon !
      }
    },

    /* Demander à vue-application de récupérer le flux video */
    async requestCameraPreview() {
      await this.$emit("get-camera-preview");
    },

    /* Obtenir les informations de la caméra */
    getCameraInfos(val) {
      if (val) {
        // obtenir piste vidéo...
        var tracks = val.getTracks();
        // ... et ne retenir que la première piste vidéo
        var videoTrackInfo = tracks.find((t) => (t.kind = "video"));
        // obtenir ses settings
        var videoTrackSettings = videoTrackInfo.getSettings();
        console.log(videoTrackSettings);

        this.videoTrack = {
          label: videoTrackInfo.label,
          resolution: `${videoTrackSettings.width}x${videoTrackSettings.height}`,
        };
      } else {
        this.videoTrack.label = "Aucune information disponible";
      }
    },

  },
};
</script>

<style scoped>
/* STYLE FIElDSET ============================================== */
legend {
  background-color: #000;
  color: #fff;
  padding: 3px 6px;
}

fieldset {
  margin-bottom: 1.5rem;
}

.article {
  height: 100%;
  margin: 0;
}

.article h3 {
  border-bottom: medium dotted black;
  margin: 0.5em 0;
}

/* STYLE APERCU CAMERA ========================================== */
.grid-wrapper {
  display: grid;
  grid-template-columns: 40% 60%;
}

.left {
  grid-column: 1 / 2;
}

.right {
  grid-column: 2 / 3;
}

#videoElement {
  width: 100%;
  background-color: #666;
}

/* STYLE TABLE ===================================================== */

.infos-table td[scope="row"] {
  padding-right: 0.5em;
  font-weight: bold;
}
</style>
