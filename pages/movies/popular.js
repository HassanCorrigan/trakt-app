import { tmdbFetch } from '../../helpers/apiFetch.js';
import { createPosterPath } from '../../helpers/createImagePath.js';
import Layout from '../../components/Layout.js';

const PopularMovies = ({ movies }) => {
  // console.log(movies);
  return (
    <Layout>
      <section>
        <h1>Popular Movies</h1>
        <div>
          {movies.map(movie => (
            <a href={`/movies/${movie.id}`} key={movie.id}>
              <img
                src={createPosterPath(movie.poster_path)}
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
  const movies = await tmdbFetch('movie/popular');

  return {
    props: {
      movies: movies.results,
    },
  };
}

export default PopularMovies;
