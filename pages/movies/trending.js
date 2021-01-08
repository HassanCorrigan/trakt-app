import { tmdbFetch } from '../../helpers/apiFetch.js';
import Layout from '../../components/Layout.js';

const TrendingMovies = ({ movies }) => {
  // console.log(movies);
  return (
    <Layout>
      <section>
        <h1>Trending Movies</h1>
        <div>
          {movies.map(movie => (
            <a href={`/movies/${movie.id}`} key={movie.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} // Update URL with smaller image size
                alt={movie.title}
              />
              <p>{movie.title}</p>
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export async function getServerSideProps() {
  const movies = await tmdbFetch('trending/movie/day');

  return {
    props: {
      movies: movies.results,
    },
  };
}

export default TrendingMovies;
