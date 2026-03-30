// index.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.min.js";

// Initialize Supabase
const SUPABASE_URL = "https://smjpwpspsmgqidhkostt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtanB3cHNwc21ncGhpZGtvc3R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODQxNjksImV4cCI6MjA5MDQ2MDE2OX0.9SeUJ9CqZCQbGoXttdhu5-9Zn4_BDwrBj9IlF-uXnqs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM elements
const buttons = document.querySelectorAll(".vote-btn");
const resultsDiv = document.getElementById("results");

// Add vote click listeners
buttons.forEach(button => {
  button.addEventListener("click", async () => {
    const choice = button.dataset.choice;

    const { data, error } = await supabase
      .from("votes")
      .insert([{ choice }]);

    if (error) {
      alert("Error voting: " + error.message);
    } else {
      fetchResults();
    }
  });
});

// Fetch live results
async function fetchResults() {
  const { data, error } = await supabase
    .from("votes")
    .select("*");

  if (error) {
    resultsDiv.innerHTML = "Error loading results";
  } else {
    const counts = {};
    data.forEach(v => {
      counts[v.choice] = (counts[v.choice] || 0) + 1;
    });

    let html = "Live Results:<br>";
    for (const [key, value] of Object.entries(counts)) {
      html += `${key}: ${value}<br>`;
    }
    resultsDiv.innerHTML = html;
  }
}

// Initial load
fetchResults();