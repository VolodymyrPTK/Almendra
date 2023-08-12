<template>
  <div>
    <h1>My Sent Packages</h1>
    <!--<ul>
        <li v-for="sentpackage in sentpackages" :key="package.id">
          <strong>{{ sentpackage.tracking_number }}</strong>
          <p>{{ sentpackage.status }}</p>
        </li>
      </ul>-->
  </div>
</template>

<script>
/**export default {
  data() {
    return {
      sentpackages: [],
    };
  },
  mounted() {
    this.fetchPackages();
  },
  methods: {
    fetchPackages() {
      const url = `https://api.novaposhta.ua/v2.0/parcels/sent`;
      const token = 'b78d2a5d64f6903591a12493aa852776';

      fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.sentpackages = data;
        });
    },
  },
}; */
</script>

<style scoped></style>
