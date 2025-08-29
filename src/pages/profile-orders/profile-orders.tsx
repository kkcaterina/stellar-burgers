import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useEffect } from 'react';
import {
  getAllUserOrdersSelector,
  getAllUserOrders
} from '../../services/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllUserOrders());
  }, []);
  const orders: TOrder[] = useSelector(getAllUserOrdersSelector) || [];

  return <ProfileOrdersUI orders={orders} />;
};
