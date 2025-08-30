import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { getAllIngredients } from '../../services/ingredientsSlice';
import { getUser } from '../../services/userSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const closeModal = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(getUser());
    dispatch(getAllIngredients());
  }, [dispatch]);

  return (
    <>
      <div className={styles.app}>
        <AppHeader />
        <Routes location={background || location}>
          <Route path='*' element={<NotFound404 />} />
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed'>
            <Route index element={<Feed />} />
            <Route path=':number' element={<OrderInfo />} />
          </Route>
          <Route
            path='/login'
            element={
              <ProtectedRoute unAuthRoute>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path='/register'
            element={
              <ProtectedRoute unAuthRoute>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path='/forgot-password'
            element={
              <ProtectedRoute unAuthRoute>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reset-password'
            element={
              <ProtectedRoute unAuthRoute>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route path='/profile'>
            <Route
              index
              element={
                <ProtectedRoute authRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path='orders'>
              <Route
                index
                element={
                  <ProtectedRoute authRoute>
                    <ProfileOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path=':number'
                element={
                  <ProtectedRoute authRoute>
                    <OrderInfo />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
          <Route path='/ingredients/:id' element={<IngredientDetails />} />
        </Routes>
        {background && (
          <Routes>
            <Route
              path='/feed/:number'
              element={
                <Modal title='' onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <Modal title='' onClose={closeModal}>
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute authRoute>
                  <Modal title='' onClose={closeModal}>
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
      </div>
    </>
  );
};

export default App;
