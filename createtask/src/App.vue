<template>
  <div
    class="min-h-screen bg-gradient-to-r from-orange-400 to-yellow-500 p-4 relative w-full"
  >
    <div class="mx-auto bg-white p-6 rounded-lg shadow-2xl">
      <h1 class="absolute text-lg font-semibold p-2">
        <span
          class="underline"
          :class="{
            'text-black': money > 20,
            'text-yellow-600': money <= 20 && money > 10,
            'text-red-500': money <= 10,
          }"
          >Money:</span
        >
        ${{ money }}
      </h1>
      <div
        :class="{
          'absolute right-12 text-lg font-semibold mt-2 p-2 rounded-lg border border-black': true,
          'text-gray-700 bg-yellow-300': timeLeft <= 15 && timeLeft > 5,
          'text-gray-700 bg-red-500': timeLeft <= 5,
        }"
        class="w-32 text-center mb-5"
      >
        Time Left: {{ timeLeft.toFixed(1) }}s
      </div>
      <h1 class="text-3xl font-extrabold mb-4 text-center text-gray-800">
        Pizza Challenge Tycoon
      </h1>
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2 text-gray-700">
          Pizza Order Challenge
        </h2>
        <div class="flex mt-4 justify-between gap-4">
          <div class="w-3/4">
            <div
              class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
            >
              <button
                v-for="(item, index) in gridItems"
                :key="index"
                class="bg-primar rounded-lg cursor-pointer h-20 btn btn-primary hover:bg-primary-dark transition"
                @click="buyItem(index)"
                :disabled="gameOver"
              >
                <div>
                  <p class="text-center text-md font-bold">{{ item.name }}</p>
                  <p class="text-center">${{ item.price }}</p>
                </div>
              </button>
            </div>
            <button
              class="btn btn-secondary mt-2 w-full py-1 text-sm font-semibold hover:bg-secondary-dark transition"
              @click="refreshOptions"
              :disabled="gameOver"
            >
              Refresh Options ($5)
            </button>
          </div>
          <div
            class="notepad bg-yellow-100 p-4 rounded-lg shadow-lg h-max w-1/4"
          >
            <h3 class="text-lg font-semibold text-gray-700">Current Order</h3>
            <p class="text-sm">
              Crust:
              <span class="font-semibold">{{ currentOrder.crust }}</span>
              <span v-if="isInInventoryOrPizza(currentOrder.crust)">✔️</span>
            </p>
            <p class="text-sm">
              Sauce:
              <span class="font-semibold">{{ currentOrder.sauce }}</span>
              <span v-if="isInInventoryOrPizza(currentOrder.sauce)">✔️</span>
            </p>
            <p class="text-sm">
              Toppings:
              <span
                v-for="(topping, index) in currentOrder.toppings"
                :key="topping"
              >
                <span class="font-semibold">{{ topping }}</span>
                <span v-if="isInInventoryOrPizza(topping)">✔️</span>
                <span v-if="index < currentOrder.toppings.length - 1">, </span>
              </span>
              <span
                v-if="currentOrder.toppings.length === 0"
                class="font-semibold"
                >None</span
              >
            </p>
            <p class="text-sm">
              Cheese:
              <span class="font-semibold">{{
                currentOrder.cheese || "None"
              }}</span>
              <span v-if="isInInventoryOrPizza(currentOrder.cheese)">✔️</span>
            </p>
            <p class="text-sm">
              Seasonings:
              <span
                v-for="(seasoning, index) in currentOrder.seasonings"
                :key="seasoning"
              >
                <span class="font-semibold">{{ seasoning }}</span>
                <span v-if="isInInventoryOrPizza(seasoning)">✔️</span>
                <span v-if="index < currentOrder.seasonings.length - 1"
                  >,
                </span>
              </span>
              <span
                v-if="currentOrder.seasonings.length === 0"
                class="font-semibold"
                >None</span
              >
            </p>
            <p class="text-sm">
              Drizzles:
              <span
                v-for="(drizzle, index) in currentOrder.drizzles"
                :key="drizzle"
              >
                <span class="font-semibold">{{ drizzle }}</span>
                <span v-if="isInInventoryOrPizza(drizzle)">✔️</span>
                <span v-if="index < currentOrder.drizzles.length - 1">, </span>
              </span>
              <span
                v-if="currentOrder.drizzles.length === 0"
                class="font-semibold"
                >None</span
              >
            </p>
            <button
              class="btn btn-primary mt-2 w-full py-1 text-sm font-semibold hover:bg-primary-dark transition"
              @click="submitOrder"
              :disabled="gameOver"
            >
              Submit Order
            </button>
          </div>
        </div>
        <div class="mt-4">
          <h3 class="text-lg font-semibold text-gray-700">Your Ingredients</h3>
          <div class="flex flex-wrap gap-1 mt-1">
            <button
              v-for="(ingredient, index) in inventory"
              :key="index"
              class="btn btn-outline text-md font-semibold"
              @click="addToPizza(ingredient)"
              :disabled="gameOver"
            >
              {{ ingredient.name }}
              <span
                class="font-bold"
                :class="{
                  'text-[#f97316] text-lg ': ingredient.quantity > 0,
                }"
                >x{{ ingredient.quantity }}</span
              >
            </button>
          </div>
        </div>
        <div class="mt-4">
          <h3 class="text-lg font-semibold text-gray-700">Make Your Pizza</h3>
          <div
            class="pizza-container relative mt-4 bg-yellow-100 rounded-lg shadow-lg border border-black"
          >
            <img
              v-for="(ingredient, index) in pizza"
              :key="index"
              :src="getImageSrc(ingredient.name)"
              :style="{ transform: `rotate(${ingredient.rotation}deg)` }"
              class="absolute w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="notification"
      class="notification fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-error p-4 rounded-lg shadow-lg"
    >
      <p class="text-lg font-semibold text-gray-700">{{ notification }}</p>
    </div>
    <div
      v-if="success"
      class="notification fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-success p-4 rounded-lg shadow-lg"
    >
      <p class="text-lg font-semibold text-gray-700">{{ success }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const possibleItems = [
  "Dough",
  "Cheese",
  "Pepperoni",
  "Mushrooms",
  "Olives",
  "Onions",
  "Tomato Sauce",
  "BBQ Sauce",
  "Thin Crust",
  "Thick Crust",
  "Pineapple",
  "Ham",
  "Bacon",
  "Green Peppers",
  "Spinach",
  "Garlic Sauce",
  "Pesto Sauce",
  "Mozzarella",
  "Cheddar",
  "Parmesan",
  "Oregano",
  "Basil",
  "Red Pepper Flakes",
  "Garlic Powder",
  "Olive Oil",
  "Balsamic Glaze",
  "Hot Honey",
];
const gridItems = ref(Array.from({ length: 24 }, () => randomItem()));
const inventory = ref([
  { name: "Thin Crust", quantity: 0 },
  { name: "Thick Crust", quantity: 0 },
  { name: "Tomato Sauce", quantity: 0 },
  { name: "BBQ Sauce", quantity: 0 },
  { name: "Garlic Sauce", quantity: 0 },
  { name: "Pesto Sauce", quantity: 0 },
  { name: "Pepperoni", quantity: 0 },
  { name: "Mushrooms", quantity: 0 },
  { name: "Olives", quantity: 0 },
  { name: "Onions", quantity: 0 },
  { name: "Pineapple", quantity: 0 },
  { name: "Ham", quantity: 0 },
  { name: "Bacon", quantity: 0 },
  { name: "Green Peppers", quantity: 0 },
  { name: "Spinach", quantity: 0 },
  { name: "Mozzarella", quantity: 0 },
  { name: "Cheddar", quantity: 0 },
  { name: "Parmesan", quantity: 0 },
  { name: "Oregano", quantity: 0 },
  { name: "Basil", quantity: 0 },
  { name: "Red Pepper Flakes", quantity: 0 },
  { name: "Garlic Powder", quantity: 0 },
  { name: "Olive Oil", quantity: 0 },
  { name: "Balsamic Glaze", quantity: 0 },
  { name: "Hot Honey", quantity: 0 },
  { name: "Dough", quantity: 1 },
]);
const pizza = ref([]);
const money = ref(100);
const currentOrder = ref({
  crust: "",
  sauce: "",
  toppings: [],
  cheese: "",
  seasonings: [],
  drizzles: [],
});
const timeLeft = ref(30);
const notification = ref("");
const success = ref("");
const gameOver = ref(false);
let timer;

function randomItem() {
  const item = possibleItems[Math.floor(Math.random() * possibleItems.length)];
  const price = Math.floor(Math.random() * 5) + 2;
  return { name: item, price };
}

function buyItem(index) {
  if (money.value >= gridItems.value[index].price) {
    money.value -= gridItems.value[index].price;
    const itemName = gridItems.value[index].name;
    const existingItem = inventory.value.find((item) => item.name === itemName);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      inventory.value.push({ name: itemName, quantity: 1 });
    }
    gridItems.value[index] = randomItem();
  } else {
    showNotification("You don't have enough money to buy this item.");
  }
}

function refreshOptions() {
  if (money.value >= 5) {
    money.value -= 5;
    gridItems.value = Array.from({ length: 24 }, () => randomItem());
  }
}

function addToPizza(ingredient) {
  if (ingredient.quantity > 0) {
    if (ingredient.name === "Dough" && pizza.value.length > 0) {
      showNotification("Dough must be the first ingredient.");
      return;
    }
    if (pizza.value.length === 0 && ingredient.name !== "Dough") {
      showNotification("Dough must be the first ingredient.");
      return;
    }
    pizza.value.push({ name: ingredient.name, rotation: Math.random() * 360 });
    ingredient.quantity--;
  } else {
    showNotification("You don't have enough of this ingredient.");
  }
}

function removeFromPizza(index) {
  const ingredient = pizza.value.splice(index, 1)[0];
  const existingItem = inventory.value.find(
    (item) => item.name === ingredient.name
  );
  if (existingItem) {
    existingItem.quantity++;
  } else {
    inventory.value.push({ name: ingredient.name, quantity: 1 });
  }
}

function getImageSrc(name) {
  return `/${name.toLowerCase().replace(" ", "_")}.png`;
}

function startOrder() {
  if (gameOver.value) return;
  const crusts = ["Thin Crust", "Thick Crust"];
  const sauces = ["Tomato Sauce", "BBQ Sauce", "Garlic Sauce", "Pesto Sauce"];
  const toppings = [
    "Pepperoni",
    "Mushrooms",
    "Olives",
    "Onions",
    "Pineapple",
    "Ham",
    "Bacon",
    "Green Peppers",
    "Spinach",
  ];
  const cheeses = ["Mozzarella", "Cheddar", "Parmesan"];
  const seasonings = ["Oregano", "Basil", "Red Pepper Flakes", "Garlic Powder"];
  const drizzles = ["Olive Oil", "Balsamic Glaze", "Hot Honey"];

  currentOrder.value.crust = crusts[Math.floor(Math.random() * crusts.length)];
  currentOrder.value.sauce = sauces[Math.floor(Math.random() * sauces.length)];
  currentOrder.value.toppings = toppings
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 5) + 1);
  currentOrder.value.cheese =
    cheeses[Math.floor(Math.random() * cheeses.length)];
  currentOrder.value.seasonings = seasonings
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 2) + 1);
  currentOrder.value.drizzles = drizzles
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 2) + 1);
  timeLeft.value =
    45 +
    currentOrder.value.toppings.length * 3.5 +
    currentOrder.value.seasonings.length * 2 +
    currentOrder.value.drizzles.length * 2;
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 0.1;
    } else {
      submitOrder();
    }
  }, 100);
}

function submitOrder() {
  if (gameOver.value) return;
  const hasDough = pizza.value.some((item) => item.name === "Dough");
  const hasCrust = pizza.value.some(
    (item) => item.name === currentOrder.value.crust
  );
  const hasSauce = pizza.value.some(
    (item) => item.name === currentOrder.value.sauce
  );
  const hasCheese = pizza.value.some(
    (item) => item.name === currentOrder.value.cheese
  );
  const correctToppings = currentOrder.value.toppings.every((topping) =>
    pizza.value.some((item) => item.name === topping)
  );
  const correctSeasonings = currentOrder.value.seasonings.every((seasoning) =>
    pizza.value.some((item) => item.name === seasoning)
  );
  const correctDrizzles = currentOrder.value.drizzles.every((drizzle) =>
    pizza.value.some((item) => item.name === drizzle)
  );
  const incorrectItems = pizza.value.filter(
    (item) =>
      item.name !== "Dough" &&
      item.name !== currentOrder.value.crust &&
      item.name !== currentOrder.value.sauce &&
      item.name !== currentOrder.value.cheese &&
      !currentOrder.value.toppings.includes(item.name) &&
      !currentOrder.value.seasonings.includes(item.name) &&
      !currentOrder.value.drizzles.includes(item.name)
  );
  const reward =
    (4 +
      currentOrder.value.toppings.length +
      currentOrder.value.seasonings.length +
      currentOrder.value.drizzles.length) *
    6;
  if (
    hasDough &&
    hasCrust &&
    hasSauce &&
    hasCheese &&
    correctToppings &&
    correctSeasonings &&
    correctDrizzles &&
    incorrectItems.length == 0
  ) {
    money.value += reward;
    showSuccess(`Order successful! You earned $${reward}.`);
  } else {
    failOrder();
  }
  pizza.value = [];
  clearInterval(timer);
  startOrder();
}

function failOrder() {
  if (gameOver.value) return;
  const penalty =
    currentOrder.value.toppings.length * 3 +
    currentOrder.value.seasonings.length * 3 +
    currentOrder.value.drizzles.length * 3;
  money.value -= penalty;
  showNotification(`Order failed! You lost $${penalty}.`);
  if (money.value <= 0) {
    showNotification("Game over! You ran out of money.");
    gameOver.value = true;
    clearInterval(timer);
  } else {
    pizza.value = [];
    clearInterval(timer);
    startOrder();
  }
}

function showNotification(message) {
  notification.value = message;
  setTimeout(() => {
    notification.value = "";
  }, 3000);
}

function showSuccess(message) {
  success.value = message;
  setTimeout(() => {
    success.value = "";
  }, 3000);
}

function isInInventoryOrPizza(item) {
  return (
    inventory.value.some(
      (ingredient) => ingredient.name === item && ingredient.quantity > 0
    ) || pizza.value.some((ingredient) => ingredient.name === item)
  );
}

onMounted(() => {
  startOrder();
});
</script>

<style scoped>
.badge {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}
.btn {
  border-radius: 0.5rem;
}
.btn-primary {
  background-color: #f97316;
  color: white;
}
.btn-primary:hover {
  background-color: #ea580c;
}
.btn-secondary {
  background-color: #f59e0b;
  color: white;
}
.btn-secondary:hover {
  background-color: #d97706;
}
.bg-primary {
  background-color: #f97316;
}
.bg-primary-dark {
  background-color: #ea580c;
}
.bg-secondary-dark {
  background-color: #d97706;
}
.notepad {
  border: 2px solid #f59e0b;
}
.pizza-container {
  position: relative;
  margin-left: 0;
  width: 200px;
  height: 200px;
}
.pizza-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.notification {
  width: 300px;
  text-align: center;
}
@media (max-width: 768px) {
  .pizza-container {
    width: 150px;
    height: 150px;
  }
}
@media (max-width: 480px) {
  .pizza-container {
    width: 120px;
    height: 120px;
  }
  .btn {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
  .notification {
    width: 250px;
  }
}
</style>
