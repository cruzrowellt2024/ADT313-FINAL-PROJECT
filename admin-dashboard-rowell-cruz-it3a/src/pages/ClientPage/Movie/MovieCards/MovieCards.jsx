import './MovieCards.css';
function MovieCards({ movie: movie, onClick }) {
  return (
    <>
      <div className='card' onClick={onClick}>
        <img 
          src={movie.posterPath || movie.backdropPath} 
          alt={movie.title || "Movie Poster"} 
        />
        <span>{movie.title}</span>
      </div>
    </>
  );
}

export default MovieCards;
