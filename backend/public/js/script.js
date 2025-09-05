// check login
async function checkLogin() {
    let res = await fetch('/api/v1/users/checkLogin')
    let data = await res.json()
    if (data.success == false) {
        // if not logged in try to refresh the tokens
        let response = await fetch('/api/v1/users/refreshToken')
        let receievedData = await response.json()
        if (receievedData.success == false) {
            // if tokens can't be refreshed redirect to login page
            console.log('user not logged in')
            window.location.href = './login.html'
        } else {
            console.log(`tokens refreshsed`)
        }
    } else {
        console.log(`user authenticated`)
    }
}

// pins
let AllPins = []
let currentPage = 1;
let currentLimit = 10;
let maxPages;
let loading = false;
const loadingAnimation = document.querySelector('.dots-container')

async function getInitialPins(page = 1, limit = 10) {
    let res = await fetch(`/api/v1/pins/pins?page=${page}&limit=${limit}`)
    let data = await res.json()
    maxPages = data.data.totalPages
    let pins = data.data.pins
    pins.forEach((pin) => {
        AllPins.push(pin)
    })
    currentPage++
    return data.data
}

// loads more pin and append to pin container
async function loadMore(page, limit) {
    // check if its already loading or not
    if (loading) return
    loading = true

    // check the page limit
    if(currentPage>maxPages) {
        console.log(`fetching ${currentPage} and total limit is ${maxPages}`)
        return
    }
    console.log(`fetching ${currentPage} and total limit is ${maxPages}`)

    // not its loading, show the loading animation
    loadingAnimation.style.display = 'flex'

    // now its loading then fetch more pins and append them in the pin container
    let res = await fetch(`/api/v1/pins/pins?page=${currentPage}&limit=${currentLimit}`)
    let data = await res.json()

    let newPins = data.data.pins
    const pinContainer = document.getElementById('pin-container');
    newPins.forEach((newPin) => {
        const pinElement = document.createElement('div');
        pinElement.className = 'pin';

        pinElement.innerHTML = `
                    <img src="${newPin.imagePath}" loading="lazy" alt="${newPin.title}" class="pin-image">
                    <div class="pin-overlay">
                        <h3 class="pin-title">${newPin.title}</h3>
                        <button class="save-btn">Save</button>
                    </div>
                `;

        pinContainer.appendChild(pinElement);
    })

    // everythings done hide the loading and make the loading false
    currentPage++
    loadingAnimation.style.display = 'none'
    loading = false
}

// Function to generate pin elements with proper masonry layout
async function generatePins() {
    await getInitialPins(1, 10)

    const pinContainer = document.getElementById('pin-container');
    pinContainer.innerHTML = '';

    AllPins.forEach(pin => {
        const pinElement = document.createElement('div');
        pinElement.className = 'pin';

        pinElement.innerHTML = `
                    <img src="${pin.imagePath}" loading="lazy" alt="${pin.title}" class="pin-image">
                    <div class="pin-overlay">
                        <h3 class="pin-title">${pin.title}</h3>
                        <button class="save-btn">Save</button>
                    </div>
                `;

        pinContainer.appendChild(pinElement);
    });
    loadingAnimation.style.display = 'none'
}

// Modal functionality
const uploadBtn = document.getElementById('upload-btn');
const modal = document.getElementById('upload-modal');
const closeModal = document.getElementById('close-modal');

uploadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Initialize pins on page load
document.addEventListener('DOMContentLoaded', () => {
    generatePins();
    checkLogin()

    // Add active class to clicked category
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        category.addEventListener('click', () => {
            categories.forEach(c => c.classList.remove('active'));
            category.classList.add('active');
        });
    });

    // Make categories scrollable with mouse wheel
    const categoriesContainer = document.querySelector('.categories');
    categoriesContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        categoriesContainer.scrollLeft += e.deltaY;
    });
});