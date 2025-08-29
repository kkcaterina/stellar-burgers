import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getAllFeeds,
  getAllOrdersSelector,
  getFeedsLoadingSelector
} from '../../services/feedSlice';

export const Feed: FC = () => {
  const loading = useSelector(getFeedsLoadingSelector);
  const orders: TOrder[] = useSelector(getAllOrdersSelector);
  const dispatch = useDispatch();

  const getFeeds = () => {
    dispatch(getAllFeeds());
  };

  useEffect(() => {
    getFeeds();
  }, [dispatch]);

  if (!orders.length || loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={getFeeds} />;
};
