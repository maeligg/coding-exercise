const $body = document.querySelector('body');
const $title = document.querySelector('#title');
const $averageStars = document.querySelector('#average-stars');
const $averageRating = document.querySelector('#average-rating');
const $reviews = document.querySelector('#reviews');
const $addReviewButton = document.querySelector('#add-review');

firebase.initializeApp({
  apiKey: 'AIzaSyBuQ7tMjLyogxXQ8aKv8EZcgZgSQW7LoDg',
  authDomain: 'gumroad-challenge-c9b79.firebaseapp.com',
  projectId: 'gumroad-challenge-c9b79',
});

const db = firebase.firestore();
const productRef = db.collection('products').doc('the-minimalist-entrepreneur'); // Here we select the specific product we want to handle, but the DB is built in a way that you can add as many different products as you want

// Generate a star rating and append the corresponding stars to the DOM
const generateRating = ($element, rating) => {
    for (i = 0; i < 5; i++) {
        const $img = document.createElement('img');
        $img.classList.add('star');

        if (i < rating) {
            $img.src = './assets/img/star-full.svg';
        } else {
            $img.src = './assets/img/star-empty.svg';
        }

        $element.append($img);
    }
}

// Get reviews
productRef.get().then(doc => {
    const data = doc.data();
    $title.innerHTML = data.title;
    $reviews.innerHTML = '';
    $averageRating.innerHTML = '';
    $averageStars.innerHTML = '';

    // Add each review to the DOM
    data.reviews.forEach(review => {
        const $reviewItem = document.createElement('li');
        $reviewItem.classList.add('review-item');

        generateRating($reviewItem, review.rating);

        const $reviewText = document.createElement('span');
        $reviewText.classList.add('review-text');

        const $reviewRating = document.createElement('span');
        $reviewRating.classList.add('review-rating');
        $reviewRating.append(document.createTextNode(review.rating));
        $reviewText.append($reviewRating);

        $reviewText.append(document.createTextNode(`, ${review.comment}`));
        $reviewItem.append($reviewText);

        $reviews.append($reviewItem);
    });

    // Calculate the average rating and add it to the DOM
    const averageRating = data.reviews.map(review => review.rating).reduce((prev, curr) => prev + curr) / data.reviews.length;
    $averageRating.append(averageRating.toFixed(1));
    generateRating($averageStars, averageRating);
});

}

getReviews();
