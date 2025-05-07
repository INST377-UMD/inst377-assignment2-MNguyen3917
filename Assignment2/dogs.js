document.addEventListener('DOMContentLoaded', async () => {
  const breedContainer = document.getElementById('breed-info');
  const buttonContainer = document.getElementById('breed-buttons');
  const carouselContainer = document.getElementById('carousel');

  breedContainer.style.display = 'none';

  let breeds = [];

  async function fetchAllBreeds() {
    let allBreeds = [];
    let url = 'https://dogapi.dog/api/v2/breeds';

    while (url) {
      try {
        const response = await fetch(url);
        const data = await response.json();
        allBreeds = allBreeds.concat(data.data);
        url = data.links?.next || null;
      } catch (err) {
        console.error('Error fetching breeds:', err);
        break;
      }
    }

    return allBreeds;
  }

  try {
    breeds = await fetchAllBreeds();

    breeds.forEach(breed => {
      const btn = document.createElement('button');
      btn.textContent = breed.attributes.name;
      btn.classList.add('button-5');
      btn.addEventListener('click', () => displayBreedInfo(breed));
      buttonContainer.appendChild(btn);
    });
  } catch (err) {
    console.error('Failed to load breeds:', err);
  }

  async function displayBreedInfo(breed) {
    breedContainer.innerHTML = '';
    breedContainer.style.display = 'block';

    const h2 = document.createElement('h2');
    h2.textContent = breed.attributes.name;

    const descP = document.createElement('p');
    descP.textContent = breed.attributes.description || 'No description available.';

    const life = breed.attributes.life;
    const lifeP = document.createElement('p');
    const lifespan = life ? `Min ${life.min} years, Max ${life.max} years` : 'Unknown';
    lifeP.textContent = `Life Span: ${lifespan}`;

    const infoBox = document.createElement('div');
    infoBox.classList.add('breed-desc-box');
    infoBox.append(descP, lifeP);

    breedContainer.append(h2, infoBox);
  }

  try {
    const resp = await fetch('https://dog.ceo/api/breeds/image/random/10');
    const { message: imgs } = await resp.json();
    imgs.forEach(url => {
      const slide = document.createElement('div');
      slide.innerHTML = `<img src="${url}" alt="Dog" style="max-height:300px;">`;
      carouselContainer.appendChild(slide);
    });
    if (window.simpleslider) {
      simpleslider.getSlider().init({
        container: carouselContainer,
        pause: 3000,
        transition: 1000
      });
    }
  } catch (err) {
    console.error('Carousel image load failed:', err);
  }
});
