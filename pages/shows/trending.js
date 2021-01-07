import { tmdbFetch } from '../../helpers/apiFetch.js';

const TrendingShows = ({ shows }) => {
  // console.log(shows);
  return (
    <section>
      <h1>Trending Shows</h1>
      <div>
        {shows.map(show => (
          <a href={`/shows/${show.id}`} key={show.id}>
            <img
              src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`} // Update URL with smaller image size
              alt={show.name}
            />
            <p>{show.name}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

export async function getServerSideProps() {
  const shows = await tmdbFetch('trending/tv/day');

  return {
    props: {
      shows: shows.results,
    },
  };
}

export default TrendingShows;
