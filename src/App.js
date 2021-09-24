import { useState, useEffect } from 'react';
import './App.css';
import Star from './Star';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";

// These tokens are safe to store in the frontend
initializeApp({
  apiKey: 'AIzaSyBuQ7tMjLyogxXQ8aKv8EZcgZgSQW7LoDg',
  authDomain: 'gumroad-challenge-c9b79.firebaseapp.com',
  projectId: 'gumroad-challenge-c9b79',
});

function App() {
  const [title, setTitle] = useState('Loading...');
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const db = getFirestore();
  const productRef = doc(db, 'products', 'the-minimalist-entrepreneur'); // Here we select the specific product we want to handle, but the DB is built in a way that you can add as many different products as you want

  const submitReview = async () => {
    await updateDoc(productRef, {
      reviews: arrayUnion({
        comment: comment,
        rating: rating
      })
    });

    setModalIsOpen(false);
  }

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "products", "the-minimalist-entrepreneur"), (doc) => {
      const data = doc.data();

      setTitle(data.title);
      setReviews(data.reviews);
      setAverageRating((data.reviews.map(review => review.rating).reduce((prev, curr) => prev + curr) / data.reviews.length).toFixed(1))
    });

    return unsub
  }, [db])

  return (
    <div className="container">
        <section className="average-block">
            <h1 id="title" className="mb-lg">{title}</h1>

            <div className="average-wrapper">
                <span id="average-rating" className="average-rating">{averageRating}</span>
                <div id="average-stars">
                  { [...Array(10)].map((x, i) => <Star key={i} full={i < averageRating * 2} />) }
                </div>
                <button id="add-review" className="review-button" onClick={() => setModalIsOpen(true)}>Add review</button>
            </div>
        </section>

        <hr/>

        <h2 className="mb-md">Reviews</h2>

        <ul id="reviews" className="reviews">
          {reviews.map((review, i) => (
            <li key={i} className="review-item">
              { [...Array(10)].map((x, i) => <Star key={i} full={i < review.rating * 2} />) }
              <span className="review-text">
                <span className="review-rating">{review.rating}</span>{`, ${review.comment}`}
              </span>
            </li>
          ))}
        </ul>
        
        {
          modalIsOpen &&
          <div className="backdrop" onClick={() => setModalIsOpen(false)}>
            <dialog id="review-modal" className="review-modal" open onClick={e => e.stopPropagation()}>
              <div id="review-modal-wrapper" className="review-modal-wrapper">
                  <form className="review-form">
                      <h2 className="h1">What's your rating ?</h2>
                      <label className="review-form__label" htmlFor="new-review-rating">Rating</label>
                      <div className="review-form__stars">
                        <button type="button" className={`review-form__star ${rating >= .5 && 'review-form__star-full'}`} onClick={() => setRating(.5)}>0.5 star</button>
                        <button type="button" className={`review-form__star ${rating >= 1 && 'review-form__star-full'}`} onClick={() => setRating(1)}>1 star</button>
                        <button type="button" className={`review-form__star ${rating >= 1.5 && 'review-form__star-full'}`} onClick={() => setRating(1.5)}>1.5 stars</button>
                        <button type="button" className={`review-form__star ${rating >= 2 && 'review-form__star-full'}`} onClick={() => setRating(2)}>2 stars</button>
                        <button type="button" className={`review-form__star ${rating >= 2.5 && 'review-form__star-full'}`} onClick={() => setRating(2.5)}>2.5 stars</button>
                        <button type="button" className={`review-form__star ${rating >= 3 && 'review-form__star-full'}`} onClick={() => setRating(3)}>3 star</button>
                        <button type="button" className={`review-form__star ${rating >= 3.5 && 'review-form__star-full'}`} onClick={() => setRating(3.5)}>3.5 stars</button>
                        <button type="button" className={`review-form__star ${rating >= 4 && 'review-form__star-full'}`} onClick={() => setRating(4)}>4 stars</button>
                        <button type="button" className={`review-form__star ${rating >= 4.5 && 'review-form__star-full'}`} onClick={() => setRating(4.5)}>4.5 stars</button>
                        <button type="button" className={`review-form__star ${rating >= 5 && 'review-form__star-full'}`} onClick={() => setRating(5)}>5 stars</button>
                      </div>
                      <input type="number" id="new-review-rating" className="review-form__rating" readOnly value={rating} />

                      <label className="review-form__label" htmlFor="new-review-comment">Review</label>
                      <textarea id="new-review-comment" cols="30" rows="3" placeholder="Start typing..." value={comment} onChange={(e) => setComment(e.target.value)}></textarea>

                      <button type="button" id="submit-review" onClick={submitReview}>Submit review</button>
                  </form>
              </div>
            </dialog>
          </div>
        }
    </div>
  );
}

export default App;
