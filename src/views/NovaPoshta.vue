<script setup>
import { ref, onMounted } from 'vue';

// Nova Poshta API key
const apiKey = '8f56fa87480210ab93cf355cabfe24be';

// Reactive state
const packages = ref([]);
const loading = ref(false);
const error = ref(null);
const currentPage = ref(1); // Start with the first page
const totalPages = ref(1); // Will be updated after the first API call

// Fetch packages with pagination
const fetchPackages = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey,
        modelName: 'InternetDocument',
        calledMethod: 'getDocumentList',
        methodProperties: {
          Page: currentPage.value, // Pass the current page
          Limit: 10, // Number of records per page (adjust if needed)
          DateTimeFrom: "01.11.2024",
          DateTimeTo: "01.12.2024",
          Page: "1",
          GetFullList: "1",
          DateTime: "15.11.2024" // Current date
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success) {
      packages.value = [...packages.value, ...data.data]; // Append new data to existing list
      totalPages.value = Math.ceil(data.info.totalCount / 10); // Calculate total pages
    } else {
      throw new Error(data.errors?.[0] || 'Unknown error');
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Fetch the next page
const loadMore = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchPackages();
  }
};

// Fetch packages on component mount
onMounted(fetchPackages);
</script>

<template>
  <div>
    <h1>All Sent Packages</h1>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <ul v-if="!loading && !error">
      <li v-for="pkg in packages" :key="pkg.Ref">
        <div class="li-item">
          <strong>Document Number:</strong> {{ pkg.IntDocNumber }}<br />
          <strong>Recipient:</strong> {{ pkg.RecipientContactPerson }}<br />
          <strong>Recipient:</strong> {{ pkg.RecipientAddressDescription }}<br />
          <strong>Status:</strong> {{ pkg.StateName }}<br />
        </div>
      </li>
    </ul>

    <div v-if="!loading && currentPage < totalPages">
      <button @click="loadMore">Load More</button>
    </div>

    <div v-if="!loading && !error && packages.length === 0">
      No packages found.
    </div>
  </div>
</template>

<style>
.error {
  color: red;
}

.li-item {
  margin: 25px;
  background-color: aqua;
}
</style>
