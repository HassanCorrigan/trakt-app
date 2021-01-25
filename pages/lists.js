import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAppContext } from 'context/AppContext';
import { getList } from 'helpers/list';
import Layout from 'components/Layout';
import LoginButton from 'components/LoginButton';
import Loader from 'components/Loader';
import PosterList from 'components/PosterList';
import styles from 'styles/lists.module.css';

const Watchlist = () => {
  const { user } = useAppContext();
  const [authenticated, setAuthenticated] = useState();
  const [loading, setLoading] = useState(true);
  const [mediaType, setMediaType] = useState('show');
  const [watchlist, setWatchlist] = useState([]);
  const [collection, setCollection] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setAuthenticated(user.authenticated);
    user.authenticated &&
      (async () => {
        const wlist = await getList('watchlist', user.token);
        const collShows = await getList('collection/shows', user.token);
        const collMovies = await getList('collection/movies', user.token);
        const histMovies = await getList('history/movies', user.token);
        const coll = collShows.concat(collMovies);
        setWatchlist(wlist);
        setCollection(coll);
        setHistory(histMovies);
        setLoading(false);
      })();
  }, []);

  const filterItems = list =>
    list.filter(item => item.type === mediaType).map(({ media }) => media);

  const handleChange = e => setMediaType(e.target.value);

  return (
    <Layout>
      <section className='page'>
        <h1>Lists</h1>

        {!authenticated ? (
          <LoginButton />
        ) : (
          <>
            <div className={styles.mediaSelector}>
              <div className={styles.option}>
                <input
                  type='radio'
                  id='show'
                  name='show'
                  value='show'
                  checked={mediaType === 'show'}
                  onChange={handleChange}
                />
                <label htmlFor='show'>Shows</label>
              </div>
              <div className={styles.option}>
                <input
                  type='radio'
                  id='movie'
                  name='movie'
                  value='movie'
                  checked={mediaType === 'movie'}
                  onChange={handleChange}
                />
                <label htmlFor='movie'>Movies</label>
              </div>
            </div>
            {loading && <Loader />}

            <div className={styles.horizontalList}>
              <div className={styles.horizontalListHeader}>
                <h2>Watchlist</h2>
                <Link href='/watchlist'>See More &#8250;</Link>
              </div>
              <PosterList
                items={filterItems(watchlist)}
                slug={`${mediaType}s`}
              />
            </div>

            <div className={styles.horizontalList}>
              <div className={styles.horizontalListHeader}>
                <h2>Collection</h2>
                <Link href='/collection'>See More &#8250;</Link>
              </div>
              <PosterList
                items={filterItems(collection)}
                slug={`${mediaType}s`}
              />
            </div>

            <div className={styles.horizontalList}>
              <div className={styles.horizontalListHeader}>
                <h2>History</h2>
                <Link href='/history'>See More &#8250;</Link>
              </div>
              <PosterList items={filterItems(history)} slug={`${mediaType}s`} />
            </div>
          </>
        )}
      </section>
    </Layout>
  );
};

export default Watchlist;
