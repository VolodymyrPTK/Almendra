<template>
  <div>
    <div class="cards-container">
      <div class="card"></div>
      <div class="card"></div>
      <div class="card"></div>
      <div class="card"></div>
      <div class="card"></div>
      <div class="card"></div>
      <div class="card"></div>
      <div class="card"></div>
      <div class="card"></div>
      <div class="card"></div>
    </div>
    <img src="../assets/background.jpg" alt="">
  </div>
</template>

<style scoped lang="scss">
.card {
  width: 250px; // Adjust width as needed
  height: 300px; // Adjust height as needed
  background-color: rgba(255, 255, 255, 0.1); // Semi-transparent white
  border-radius: 10px; // Rounded corners
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); // Card shadow
  transition: all 0.3s ease-in-out; // Smooth transition for hover effect
  overflow: hidden; // Ensures content doesn't spill out
  margin: 15px; // Space between cards

  &:hover {
    transform: translateY(-10px); // Moves card up on hover
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); // Enhances shadow on hover
  }
}

.cards-container {
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around; // Evenly spaces the cards within the container
  padding: 20px; // Padding around the container
}
</style>