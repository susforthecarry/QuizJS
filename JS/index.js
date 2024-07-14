  /// <reference types="../@types/jquery" />

  let imageSelection = document.querySelector('.inner img');

// this is for navbar 
  document.getElementById('barrs').addEventListener('click', function() {
    document.querySelector('.icon').classList.toggle('d-none');
    document.querySelector('.navbarContent').classList.toggle('active');
  });
  
  document.querySelector('.fa-times').addEventListener('click', function() {
    document.querySelector('.icon').classList.add('d-none');
    document.querySelector('.navbarContent').classList.remove('active');
  });

  


  
  // this for making logo clickable to move it to home page 
  document.addEventListener('DOMContentLoaded', function() {
    function clickOnLogo() {
      let x = document.querySelector('#logo');
      if (x) {
        x.addEventListener('click', function() {
          window.location.assign('index.html');
        });
      }
    }
    clickOnLogo();
  });



// this for home page 

  async function getSrc() {
    let allData = [];
    for (let i = 70; i < 90; i++) {
      try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=527${i}`);
        let finalData = await response.json();
        if (finalData.meals) {
          allData.push(finalData.meals[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    displayAllData(allData);
  }

  function displayAllData(allData) {
    let cartona = '';
    for (let i = 0; i < allData.length; i++) {
      cartona += `
              <div class="col-3 position-relative" id="col">
                <img src="${allData[i].strMealThumb}" class="image w-100 border rounded-2 m-2 p-2 border-black" id="ll">
                <div class="overlay">
                  <div class="text">${allData[i].strMeal}</div>
                </div>
              </div>
      `;
    }
    document.getElementById('row').innerHTML = cartona;
  }

  getSrc();


  // this for categ page 
  let allData2 = [];
  
  async function categroicalSrc() {
    try {
      let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
      let finalData = await response.json();
      allData2 = finalData.categories.slice(0, 14);
      displayDataForcPage();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  function displayDataForcPage() {
    let cartona2 = '';
    for (let i = 0; i < allData2.length; i++) {
      cartona2 += `
        <div class="col-3 position-relative" id="col">
          <img src="${allData2[i].strCategoryThumb}" class="image w-100 border rounded-2 m-2 p-2 border-black" id="ll">
          <div class="overlay">
            <div class="text">${allData2[i].strCategory}</div>
          </div>
        </div>
      `;
    }
    document.getElementById('row2').innerHTML = cartona2;
  }
  
  categroicalSrc();
  











  // this for area page 

  // Function to fetch areas and display them
async function fetchAreas() {
  try {
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    let finalData = await response.json();
    if (finalData.meals) {
      displayAreas(finalData.meals);
    }
  } catch (error) {
    console.error('Error fetching areas:', error);
  }
}

// Function to display areas dynamically
function displayAreas(areas) {
  let cartona = '';
  for (let i = 0; i < areas.length; i++) {
    cartona += `
      <div class="col-3">
        <div class="area-item" onclick="fetchAreaData('${areas[i].strArea}')">
          <img src="https://via.placeholder.com/300x200?text=${areas[i].strArea}" alt="${areas[i].strArea}">
          <div class="text">${areas[i].strArea}</div>
        </div>
      </div>
    `;
  }
  document.getElementById('row3').innerHTML = cartona;
}

// Function to fetch and display meals by area
async function fetchAreaData(area) {
  try {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let finalData = await response.json();
    if (finalData.meals) {
      displayAreaData(area, finalData.meals);
    } else {
      console.error('No meals found for area:', area);
    }
  } catch (error) {
    console.error('Error fetching area data:', error);
  }
}

// Function to display meals from a specific area
function displayAreaData(area, meals) {
  document.getElementById('area-title').innerText = `Meals from ${area}`;
  let cartona = '';
  for (let i = 0; i < meals.length; i++) {
    cartona += `
      <div class="col-3 position-relative">
        <img src="${meals[i].strMealThumb}" class="image w-100 border rounded-2 m-2 p-2 border-black" alt="${meals[i].strMeal}">
        <div class="overlay">
          <div class="text">${meals[i].strMeal}</div>
        </div>
        <button class="btn btn-danger view-details" data-mealid="${meals[i].idMeal}">View Details</button>
      </div>
    `;
  }
  document.getElementById('area-content').innerHTML = cartona;
  document.querySelector('.container').style.display = 'none';
  document.getElementById('area-page').style.display = 'block';

  // Add event listeners to view details buttons
  const viewDetailButtons = document.querySelectorAll('.view-details');
  viewDetailButtons.forEach(button => {
    button.addEventListener('click', function() {
      const mealId = this.getAttribute('data-mealid');
      fetchMealDetails(mealId);
    });
  });
}

// Function to fetch meal details by ID
async function fetchMealDetails(mealId) {
  try {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    let data = await response.json();
    if (data.meals) {
      displayMealDetails(data.meals[0]);
    }
  } catch (error) {
    console.error('Error fetching meal details:', error);
  }
}

// Function to display meal details
function displayMealDetails(meal) {
  const mealDetails = document.getElementById('mealDetails');
  mealDetails.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <p><strong>Category:</strong> ${meal.strCategory}</p>
    <p><strong>Area:</strong> ${meal.strArea}</p>
    <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
    <h3>Ingredients:</h3>
    <ul>
      ${getIngredientsList(meal).map(ingredient => `<li>${ingredient}</li>`).join('')}
    </ul>
    <a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>
  `;
  openModal();
}

// Function to get ingredients list from meal object
function getIngredientsList(meal) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    }
  }
  return ingredients.filter(Boolean); // Filter out any empty ingredients
}

// Function to open modal
function openModal() {
  const modal = document.getElementById('mealDetailModal');
  modal.style.display = 'block';
}

// Function to close modal
function closeModal() {
  const modal = document.getElementById('mealDetailModal');
  modal.style.display = 'none';
}

// Event listener for closing the modal
document.querySelector('.close').addEventListener('click', closeModal);

// Event listener for clicking outside the modal to close it
window.addEventListener('click', function(event) {
  const modal = document.getElementById('mealDetailModal');
  if (event.target === modal) {
    closeModal();
  }
});

// Initialize fetching areas when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
  fetchAreas();
});



















// Function to fetch ingredients and display them
async function fetchIngredients() {
  try {
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    let finalData = await response.json();
    if (finalData.meals) {
      displayIngredients(finalData.meals);
    }
  } catch (error) {
    console.error('Error fetching ingredients:', error);
  }
}

// Function to display ingredients dynamically
function displayIngredients(ingredients) {
  let cartona = '';
  for (let i = 0; i < ingredients.length; i++) {
    cartona += `
      <div class="col-3">
        <div class="ingredient-item" onclick="fetchIngredientData('${ingredients[i].strIngredient}')">
          <img src="https://via.placeholder.com/300x200?text=${ingredients[i].strIngredient}" alt="${ingredients[i].strIngredient}">
          <div class="text">${ingredients[i].strIngredient}</div>
        </div>
      </div>
    `;
  }
  document.getElementById('ingredient-row').innerHTML = cartona;
}

// Function to fetch and display meals by ingredient
async function fetchIngredientData(ingredient) {
  try {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    let finalData = await response.json();
    if (finalData.meals) {
      displayIngredientData(ingredient, finalData.meals);
    } else {
      console.error('No meals found for ingredient:', ingredient);
    }
  } catch (error) {
    console.error('Error fetching ingredient data:', error);
  }
}

// Function to display meals using a specific ingredient
function displayIngredientData(ingredient, meals) {
  document.getElementById('ingredient-title').innerText = `Meals with ${ingredient}`;
  let cartona = '';
  for (let i = 0; i < meals.length; i++) {
    cartona += `
      <div class="col-3 position-relative">
        <img src="${meals[i].strMealThumb}" class="image w-100 border rounded-2 m-2 p-2 border-black" alt="${meals[i].strMeal}">
        <div class="overlay">
          <div class="text">${meals[i].strMeal}</div>
        </div>
        <button class="btn btn-danger view-details" data-mealid="${meals[i].idMeal}">View Details</button>
      </div>
    `;
  }
  document.getElementById('ingredient-content').innerHTML = cartona;
  document.querySelector('.container').style.display = 'none';
  document.getElementById('ingredient-page').style.display = 'block';

  // Add event listeners to view details buttons
  const viewDetailButtons = document.querySelectorAll('.view-details');
  viewDetailButtons.forEach(button => {
    button.addEventListener('click', function() {
      const mealId = this.getAttribute('data-mealid');
      fetchMealDetails(mealId);
    });
  });
}

// Function to fetch meal details by ID
async function fetchMealDetails(mealId) {
  try {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    let data = await response.json();
    if (data.meals) {
      displayMealDetails(data.meals[0]);
    }
  } catch (error) {
    console.error('Error fetching meal details:', error);
  }
}

// Function to display meal details
function displayMealDetails(meal) {
  const mealDetails = document.getElementById('mealDetails');
  mealDetails.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <p><strong>Category:</strong> ${meal.strCategory}</p>
    <p><strong>Area:</strong> ${meal.strArea}</p>
    <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
    <h3>Ingredients:</h3>
    <ul>
      ${getIngredientsList(meal).map(ingredient => `<li>${ingredient}</li>`).join('')}
    </ul>
    <a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>
  `;
  openModal();
}

// Function to get ingredients list from meal object
function getIngredientsList(meal) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    }
  }
  return ingredients.filter(Boolean); // Filter out any empty ingredients
}

// Function to open modal
function openModal() {
  const modal = document.getElementById('mealDetailModal');
  modal.style.display = 'block';
}

// Function to close modal
function closeModal() {
  const modal = document.getElementById('mealDetailModal');
  modal.style.display = 'none';
}

// Event listener for closing the modal
document.querySelector('.close').addEventListener('click', closeModal);

// Event listener for clicking outside the modal to close it
window.addEventListener('click', function(event) {
  const modal = document.getElementById('mealDetailModal');
  if (event.target === modal) {
    closeModal();
  }
});

// Initialize fetching ingredients when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
  fetchIngredients();
});

  

  















// for search page 
document.addEventListener('DOMContentLoaded', function() {
  const searchByNameInput = document.getElementById('searchByNameInput');
  const searchByLetterInput = document.getElementById('searchByLetterInput');
  const row = document.getElementById('row');
  const resultsByName = document.getElementById('resultsByName');
  const resultsByLetter = document.getElementById('resultsByLetter');

  searchByNameInput.addEventListener('input', function() {
      let searchByName = searchByNameInput.value.trim();
      if (searchByName !== '') {
          fetchMealsByName(searchByName);
      } else {
          clearPreviousResults();
      }
  });

  searchByLetterInput.addEventListener('input', function() {
      let searchByLetter = searchByLetterInput.value.trim();
      if (searchByLetter !== '' && searchByLetter.length === 1) {
          fetchMealsByFirstLetter(searchByLetter);
      } else {
          clearPreviousResults();
      }
  });

  async function fetchMealsByName(name) {
      clearPreviousResults();
      try {
          let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
          let data = await response.json();
          displayMeals(data.meals, resultsByName);
      } catch (error) {
          console.error('Error fetching meals by name:', error);
      }
  }

  async function fetchMealsByFirstLetter(letter) {
      clearPreviousResults();
      try {
          let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
          let data = await response.json();
          displayMeals(data.meals, resultsByLetter);
      } catch (error) {
          console.error('Error fetching meals by first letter:', error);
      }
  }

  function displayMeals(meals, container) {
      container.innerHTML = ''; // Clear previous results
      if (!meals) {
          container.innerHTML = '<p>No meals found.</p>';
          return;
      }

      meals.forEach(meal => {
          let mealDiv = document.createElement('div');
          mealDiv.classList.add('col-3', 'position-relative');
          mealDiv.setAttribute('data-mealid', meal.idMeal);

          mealDiv.innerHTML = `
              <img src="${meal.strMealThumb}" class="image w-100" alt="${meal.strMeal}">
              <div class="overlay">
                  <div class="text">${meal.strMeal}</div>
              </div>
          `;
          container.appendChild(mealDiv);
          mealDiv.addEventListener('click', function() {
              fetchMealDetails(meal.idMeal);
          });
      });
  }

  async function fetchMealDetails(mealId) {
      try {
          let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
          let data = await response.json();
          if (data.meals) {
              displayMealDetails(data.meals[0]);
          }
      } catch (error) {
          console.error('Error fetching meal details:', error);
      }
  }

  function displayMealDetails(meal) {
      const mealDetails = document.getElementById('mealDetails');
      mealDetails.innerHTML = `
          <h2>${meal.strMeal}</h2>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <p><strong>Category:</strong> ${meal.strCategory}</p>
          <p><strong>Area:</strong> ${meal.strArea}</p>
          <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
          <h3>Ingredients:</h3>
          <ul>
              ${getIngredientsList(meal).map(ingredient => `<li>${ingredient}</li>`).join('')}
          </ul>
          <a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>
      `;
      openModal();
  }

  function getIngredientsList(meal) {
      let ingredients = [];
      for (let i = 1; i <= 20; i++) {
          if (meal[`strIngredient${i}`]) {
              ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
          }
      }
      return ingredients.filter(Boolean); // Filter out empty ingredient entries
  }

  function openModal() {
      const modal = document.getElementById('mealDetailModal');
      modal.style.display = 'block';
  }

  function closeModal() {
      const modal = document.getElementById('mealDetailModal');
      modal.style.display = 'none';
  }

  function clearPreviousResults() {
      resultsByName.innerHTML = '';
      resultsByLetter.innerHTML = '';
      row.innerHTML = '';
  }

  // Event listener for closing the modal
  document.querySelector('.close').addEventListener('click', closeModal);

  // Event listener for clicking outside the modal to close it
  window.addEventListener('click', function(event) {
      const modal = document.getElementById('mealDetailModal');
      if (event.target === modal) {
          closeModal();
      }
  });

});








// this for contact us page
function validateForm() {
  // Basic validation for demonstration purposes
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const age = document.getElementById('age').value.trim();
  const password = document.getElementById('password').value.trim();
  const repassword = document.getElementById('repassword').value.trim();

  if (name === '' || email === '' || phone === '' || age === '' || password === '' || repassword === '') {
    alert('Please fill in all fields.');
    return false;
  }

  if (password !== repassword) {
    alert('Passwords do not match.');
    return false;
  }

  // Additional validation logic can be added here

  return true; // Form submission allowed
}