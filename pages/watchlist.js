import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAppContext } from 'context/AppContext';
import { createList, sortList, filterList } from 'helpers/list';
import Layout from 'components/Layout';
import LoginButton from 'components/LoginButton';
import Loader from 'components/Loader';
import RefreshButton from 'components/RefreshButton';
import MediaSortSelect from 'components/MediaSortSelect';
import MediaTypeSelect from 'components/MediaTypeSelect';
import Poster from 'components/Poster';
import styles from 'styles/lists.module.css';

const Watchlist = () => {
  const { user } = useAppContext();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('title');
  const [mediaType, setMediaType] = useState('show');
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    setAuthenticated(user.authenticated);
    setMediaType(localStorage.getItem('media-type') || 'show');

    user.authenticated &&
      (async () => {
        const list =
          JSON.parse(localStorage.getItem('watchlist')) || (await fetchList());
        setWatchlist(list);
        setLoading(false);
      })();
  }, []);

  const handleRefresh = async () => setWatchlist(await fetchList());

  const fetchList = async () => {
    const showWatchlist = await createList('watchlist/shows', user.token);
    const movieWatchlist = await createList('watchlist/movies', user.token);
    const watchlist = showWatchlist.concat(movieWatchlist);

    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    return watchlist;
  };

  return (
    <Layout>
      <section className='page'>
        <h1>Watchlist</h1>

        {!authenticated ? (
          <LoginButton />
        ) : (
          <>
            {loading && <Loader />}
            <div className={styles.controls}>
              <MediaSortSelect
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
              <RefreshButton updateList={handleRefresh} />
            </div>

            <MediaTypeSelect
              mediaType={mediaType}
              setMediaType={setMediaType}
            />

            <div className={styles.list}>
              {filterList(watchlist, mediaType)
                .sort(sortList(sortOrder))
                .map((item, index) => (
                  <Link href={item.slug} key={index}>
                    <a>
                      <Poster media={item.poster} />
                      <p>{item.title}</p>
                    </a>
                  </Link>
                ))}
            </div>
          </>
        )}
      </section>
    </Layout>
  );
};

export default Watchlist;
