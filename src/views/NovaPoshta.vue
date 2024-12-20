<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Nova Poshta API key
const apiKey = '8f56fa87480210ab93cf355cabfe24be';

// Reactive state
const packages = ref([]);
const loading = ref(false);
const error = ref(null);
const currentPage = ref(1); // Start with the first page
const totalPages = ref(1); // Will be updated after the first API call
const searchQuery = ref('');
const filteredPackages = ref([]);

// Fetch packages with pagination
const fetchPackages = async () => {
  loading.value = true;
  error.value = null;

  try {
    const currentDate = new Date();
    const lastWeekDate = new Date(currentDate);
    lastWeekDate.setDate(currentDate.getDate() - 7); // Resta 7 días a la fecha actual

    const formattedCurrentDate = currentDate.toLocaleDateString('uk-UA');
    const formattedLastWeekDate = lastWeekDate.toLocaleDateString('uk-UA');

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
          Page: currentPage.value,
          Limit: 10,
          DateTimeFrom: formattedLastWeekDate, // Fecha de hace una semana
          DateTimeTo: formattedCurrentDate,    // Fecha actual
          GetFullList: "1"
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success) {
      packages.value = [...packages.value, ...data.data]; // Append new data to existing list
      filteredPackages.value = packages.value; // Initialize filtered packages
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

// Add new search function
const searchPackages = () => {
  if (!searchQuery.value.trim()) {
    filteredPackages.value = packages.value;
    return;
  }

  const query = searchQuery.value.toLowerCase();
  filteredPackages.value = packages.value.filter(pkg =>
    pkg.RecipientContactPerson?.toLowerCase().includes(query) ||
    pkg.RecipientAddressDescription?.toLowerCase().includes(query) ||
    pkg.RecipientsPhone?.toLowerCase().includes(query)
  );
};

// Add scroll handler
const handleScroll = () => {
  const bottomOfWindow = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;

  if (bottomOfWindow && !loading.value && currentPage.value < totalPages.value) {
    loadMore();
  }
};

// Update onMounted and add onUnmounted
onMounted(() => {
  fetchPackages();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="nova-poshta-container">
    <h1>Nova Poshta Packages</h1>

    <div class="search-container">
      <input type="text" v-model="searchQuery" @input="searchPackages"
        placeholder="Search by city, name or phone number..." class="search-input" />
    </div>

    <div v-if="loading && !packages.length" class="loading-indicator">
      Loading packages...
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <ul v-if="!loading || packages.length">
      <li v-for="pkg in filteredPackages" :key="pkg.Ref">
        <div class="li-item">
          <div class="package-info-row">
            <strong>Document №:</strong>
            <span>{{ pkg.IntDocNumber }}</span>
          </div>
          <div class="package-info-row">
            <strong>Recipient:</strong>
            <span>{{ pkg.RecipientContactPerson }}</span>
          </div>
          <div class="package-info-row">
            <strong>Address:</strong>
            <span>{{ pkg.RecipientAddressDescription }}</span>
          </div>
          <div class="status-badge">
            {{ pkg.StateName }}
          </div>
        </div>
      </li>
    </ul>

    <div v-if="loading" class="loading-indicator">
      Loading more packages...
    </div>

    <div v-if="!loading && !error && filteredPackages.length === 0" class="empty-state">
      No packages found.
    </div>
  </div>
</template>

<style>
/* Container styles */
.nova-poshta-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* Title styles */
h1 {
  font-size: 28px;
  font-weight: 500;
  color: #1d1d1f;
  margin-bottom: 24px;
  text-align: center;
}

/* Search input styles */
.search-container {
  margin: 20px 0 30px;
}

.search-input {
  width: 100%;
  max-width: 600px;
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  background-color: #f5f5f7;
  color: #1d1d1f;
  transition: all 0.2s ease;
  display: block;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  outline: none;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(0, 125, 250, 0.1);
}

/* Package list styles */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.li-item {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.li-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.li-item strong {
  color: #86868b;
  font-weight: 500;
  font-size: 14px;
  display: inline-block;
  width: 120px;
}

.li-item span {
  color: #1d1d1f;
  font-size: 15px;
}

.package-info-row {
  margin: 8px 0;
  display: flex;
  align-items: baseline;
}

/* Status badge */
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 13px;
  font-weight: 500;
  background-color: #e8f5e9;
  color: #2e7d32;
  margin-top: 8px;
}

/* Loading states */
.loading-indicator {
  text-align: center;
  padding: 20px;
  color: #86868b;
  font-size: 15px;
}

.error {
  color: #ff3b30;
  text-align: center;
  padding: 16px;
  background-color: #ffebee;
  border-radius: 8px;
  margin: 16px 0;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #86868b;
  font-size: 16px;
}
</style>
