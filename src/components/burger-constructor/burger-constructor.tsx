import { FC, useMemo } from 'react';
import { useState, useEffect } from 'react';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { constructorSelector } from '../../services/constructorSlice';
import {
  resetOrder,
  loadingSelector,
  orderResponseSelector,
  orderBurger
} from '../../services/orderSlice';
import { deleteIngredients } from '../../services/constructorSlice';
import { useNavigate } from 'react-router-dom';
import { userSelector } from '../../services/userSlice';

export const BurgerConstructor: FC = () => {
  const user = useSelector(userSelector);
  const constructorItems = useSelector(constructorSelector);
  const orderRequest = useSelector(loadingSelector);
  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);
  const orderResponse = useSelector(orderResponseSelector);

  const dispatch = useDispatch();
  useEffect(() => {
    if (orderResponse?.order) {
      setOrderModalData(orderResponse.order);
      dispatch(resetOrder());
      dispatch(deleteIngredients());
    }
  }, [orderResponse]);

  const navigate = useNavigate();
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (user) {
      const ingredientsId = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((ingredient) => ingredient._id),
        constructorItems.bun._id
      ];
      dispatch(orderBurger(ingredientsId));
    } else {
      navigate('/login');
    }
  };

  const closeOrderModal = () => {
    setOrderModalData(null);
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
