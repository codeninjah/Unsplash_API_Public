//alert("Hej");
var photoDiv = document.getElementById("photo-div");
var searchBox = document.getElementById("search");
var pagination = document.getElementById("pagination");


var header = document.getElementsByTagName("h1")[0];


header.addEventListener("click", () => {
    getPhoto();
})


//UNSPLASH API KEY
var UNSPLASH_ACCESS_KEY = "Your API key here"; //It won't work without because the Unsplash API requires you to register for a API key

const headers = new Headers({
    'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
});


// Function to get a random photo
async function getPhoto(){

    photoDiv.innerHTML = " ";
    pagination.innerHTML = " ";

    if(document.getElementsByClassName("first-page-photo")[0])
    {
        document.body.removeChild(document.getElementsByClassName("first-page-photo")[0]);
    }

    const url = 'https://api.unsplash.com/photos/random';
    const response = await fetch(url, {
        headers
    });
    
    const data = await response.json();

    const element = document.createElement("div");
    document.body.appendChild(element);
    element.classList.add("first-page-photo");
    element.innerHTML = "<img src='" + data.urls.regular + "'</div>";
    const firstPagePhoto = element.getElementsByTagName("img")[0];
    firstPagePhoto.classList.add("singlePhoto");

}


// Den här är gammalt kod som jag experimenterat med
async function searchPhotos(pageNr, query) {    

    photoDiv.innerHTML = "";

    if (query.length > 2) {
        photoDiv.innerHTML = "";
        //const url = 'https://api.unsplash.com/search/photos?page=${pageNr}&query=${query}';
        const url = `https://api.unsplash.com/search/photos?page=${pageNr}&query=${query}`;
        const response = await fetch(url, {
            headers
        });

        const data = await response.json();
        console.log(data);
        console.log(data.results[0]); //undefined
        console.log("Data total is: ", data.total);
        console.log("Total pages are: ", data.total_pages);

        
        var parent = photoDiv;
        var child = document.createElement("ul");
        parent.appendChild(child);

        for(let result of data.results){
            var childchild = document.createElement("li");
            child.appendChild(childchild);
            childchild.innerHTML = `<img src="${result.urls.small}">`;
        }

        //pagination.innerText = data.total_pages; // Number of pages
        for(let i = 0; i < data.total_pages; i++) {
            let paginationLinkNumber = i + 1;
            //pagination.innerText += " " + i + " "; // Works to print the values of i
            //pagination.innerText += "It works!"; // WOrks to print "It works"
            pagination.innerHTML += ` <a href="${searchPerPage(i, search_box.value)}" data-template="pagetemplate.html">${paginationLinkNumber}</a> `;
        }

    } else if (query.length < 3) {
        photo_id.innerHTML = " ";
    }
}



async function searchPerPage(pageNr, query) {
        //const url = 'https://api.unsplash.com/search/photos?page=${pageNr}&query=${query}';
        const url = `https://api.unsplash.com/search/photos?per_page=15&page=${pageNr}&query=${query}`;
        const response = await fetch(url, {
            headers
        });
        const data = await response.json();

        return data;
}

// Function to render images
function renderImages(data) {

    const body = document.getElementsByTagName("body")[0];
    const firstPagePhotoDiv = document.getElementsByClassName("first-page-photo");

    while(firstPagePhotoDiv.length > 0){
        body.removeChild(firstPagePhotoDiv[0]);
    }


        photoDiv.innerHTML = '';  // Clear previous content
        data.results.forEach(photo => {
            console.log("Images are rendered");

            // Crate a div, add the class 'image-wrapper' and append it to photoDiv
            const imgWrapper = document.createElement("div");
            imgWrapper.classList.add("image-wrapper");
            photoDiv.appendChild(imgWrapper);

            // Create div, add the class "image-container" and append it to 
            const imgContainer = document.createElement("div");
            imgContainer.classList.add("image-container");
            imgWrapper.appendChild(imgContainer);

            // Create an image element and add all the needed properties
            const imgElement = document.createElement('img');
            //imgElement.src = photo.urls.regular; // Testar
            imgElement.src = photo.urls.small // Thumbnail versionens
            console.log("Thumbnail src is: ", imgElement.src);
            imgElement.modalsrc = photo.urls.regular; // I want to pass this property to the modal
            imgElement.alt = photo.alt_description;
            imgElement.className = "zoom-image fixed-size cursor-pointer m-2 openModal";
            imgContainer.appendChild(imgElement);
        });

        
    // New code - added 23.07.2024
    // Calculate the number of placeholders needed
    const totalPhotos = data.results.length;
    const placeholdersNeeded = 15 - totalPhotos;

    for (let i = 0; i < placeholdersNeeded; i++) {
        const placeholder = document.createElement('div');
        placeholder.className = 'image-wrapper placeholder';
        const container = document.createElement('div');
        container.className = 'image-container';
        placeholder.appendChild(container);
        photoDiv.appendChild(placeholder);
    }
}


// Function to create pagination links
function createPagination(totalPages, query) {
    pagination.innerHTML = '';  // Clear previous pagination
    for (let i = 0; i < totalPages; i++) {
        let paginationLinkNumber = i + 1;
        let link = document.createElement('a');
        link.href = '#';
        link.dataset.page = i + 1;
        link.dataset.query = query;
        link.textContent = paginationLinkNumber;

        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const pageNr = event.target.dataset.page;
            const query = event.target.dataset.query;
            const data = await searchPerPage(pageNr, query);
            renderImages(data);
        });

        pagination.appendChild(link);
    }
}


// Initial search and pagination setup
searchBox.addEventListener('keypress', async (event) => {
    if (searchBox.value.length > 2 && event.key === 'Enter') {
        const query = searchBox.value;
        const data = await searchPerPage(1, query);
        renderImages(data);
        createPagination(data.total_pages, query);
       }
});


function modal() {
    document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    
    // Get modal element
    var modal = document.getElementById('modal');
    // Get modal image element
    var modalImage = document.getElementById('modalImage');
    // Get close button
    var closeModalBtn = document.getElementById('closeModal');
    
    // Event delegation for opening modal
    photoDiv.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('openModal')) {
            var imgSrc = event.target.modalsrc;
            console.log('Image clicked:', imgSrc);
            modalImage.src = imgSrc;
            modal.classList.remove('hidden');
            document.body.classList.add('modal-active');
        }
    });
    
    // Listen for close click
    closeModalBtn.addEventListener('click', function() {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-active');
    });
    
    // Listen for outside click
    window.addEventListener('click', function(e) {
        if (e.target == modal) {
            modal.classList.add('hidden');
            document.body.classList.remove('modal-active');
        }
    });
 });
}



// Calling the getPhoto() function - fetches a random photo
getPhoto();
modal();
