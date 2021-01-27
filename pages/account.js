import { useState, useEffect } from 'react';
import { useAppContext } from 'context/AppContext';
import { traktFetch } from 'helpers/apiFetch';
import { logOut } from 'helpers/auth';
import Layout from 'components/Layout';
import LoginButton from 'components/LoginButton';
import Loader from 'components/Loader';
import styles from 'styles/account.module.css';

const Account = () => {
  const { user } = useAppContext();
  const [authenticated, setAuthenticated] = useState();
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    setAuthenticated(user.authenticated);
    user.authenticated && setDetails() && setStats();
  }, []);

  const setDetails = async () => {
    const data = await traktFetch('users/me', user.token, 'extended=full');
    setUserDetails(await data);
    setLoading(false);
  };

  const setStats = async () => {
    const stats = await traktFetch('users/me/stats', user.token);
    delete stats.ratings;
    delete stats.seasons;
    delete stats.network;
    setUserStats(stats);
    setLoading(false);
  };

  return (
    <Layout>
      <section className='page'>
        <h1>Account</h1>
        <div className={styles.content}>
          {!authenticated ? (
            <LoginButton />
          ) : (
            <>
              {loading && <Loader />}
              <div className={styles.details}>
                <img
                  className={styles.avatar}
                  src={userDetails.images?.avatar.full}
                  alt='User Profile Photo'
                />
                <p>
                  {userDetails.name} - @{userDetails.username}
                </p>
              </div>
              <div className={styles.wrapper}>
                <h2>Account Stats</h2>
                <p>
                  A selection of account statisics about you and your viewing
                  habits.
                </p>

                <div className={styles.statsOverview}>
                  {Object.keys(userStats).map((key, index) => (
                    <div key={index} className={styles.category}>
                      <h3>{key}</h3>
                      <div className={styles.stats}>
                        <div>
                          <p className={styles.value}>
                            {userStats[key].watched}
                          </p>
                          <p className={styles.label}>Watched</p>
                        </div>
                        <div>
                          <p className={styles.value}>
                            {userStats[key].collected}
                          </p>
                          <p className={styles.label}>Collected</p>
                        </div>
                        <div>
                          <p className={styles.value}>
                            {userStats[key].ratings}
                          </p>
                          <p className={styles.label}>Rated</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className={styles.btn} onClick={() => logOut()}>
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Account;
