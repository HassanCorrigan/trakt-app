import Link from 'next/link';
import { tmdbFetch } from 'helpers/apiFetch';
import { createBannerPath } from 'helpers/createImagePath';
import { useState } from 'react';
import { useAppContext } from 'context/AppContext';
import Layout from 'components/Layout';
import MediaHeader from 'components/MediaHeader';
import TraktActions from 'components/TraktActions';
import PosterList from 'components/PosterList';
import styles from 'styles/media-page.module.css';

const Show = ({ show }) => {
  const context = useAppContext();
  const [authenticated, setAuthenticated] = useState(context.isAuthenticated);

  return (
    <Layout>
      <section>
        <MediaHeader
          title={show.name}
          banner={show.backdrop_path}
          poster={show}
        />

        <div className={styles.content}>
          <div className={styles.info}>
            <p>Run Time: {show.episode_run_time[0]} mins</p>
            <p>First Aired: {show.first_air_date.slice(0, 4)}</p>
            <p>
              Average Rating: &#11088; <b>{show.vote_average}</b> (
              {show.vote_count} votes)
            </p>

            {show.next_episode_to_air !== null && (
              <div>{show.next_episode_to_air.air_date}</div>
            )}

            {show.networks.map(network => (
              <span className='tag' key={network.id}>
                {network.name}{' '}
              </span>
            ))}
          </div>

          {authenticated && <TraktActions />}

          <p className={styles.overview}>{show.overview}</p>

          <div className={styles.seasonOverview}>
            {show.number_of_seasons <= 1 ? (
              <h3>{show.number_of_seasons} Season</h3>
            ) : (
              <h3>{show.number_of_seasons} Seasons</h3>
            )}
            <PosterList items={show.seasons} slug={`shows/${show.id}/season`} />
          </div>

          {show.last_episode_to_air && (
            <div className={styles.recentEpisode}>
              <h3>Latest Episode</h3>
              <Link
                href={`/shows/${show.id}/season/${show.last_episode_to_air.season_number}/episode/${show.last_episode_to_air.episode_number}`}>
                <a>
                  <img
                    src={createBannerPath(show.last_episode_to_air.still_path)}
                    alt={show.last_episode_to_air.name}
                    className={styles.still}
                  />
                </a>
              </Link>
            </div>
          )}

          <div className={styles.meta}>
            {show.genres.map(genre => (
              <span className='tag' key={genre.id}>
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  const show = await tmdbFetch(`tv/${params.show}`);

  return {
    props: {
      show,
    },
  };
}

export default Show;
