import { FC, memo, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  getOrderByNumberApiAsync,
  ordersSlice
} from '../../services/slices/ordersSlice';
import { OrderInfoProps } from './type';

export const OrderInfo: FC<OrderInfoProps> = memo(({ isModal }) => {
  const dispatch = useDispatch();
  const orderData = useSelector((state) => state.orders.orderModalData);
  const loading = useSelector((state) => state.orders.loading);

  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.ingredients
  );

  const orderId = Number(useParams().number);

  useEffect(() => {
    dispatch(ordersSlice.actions.clearOrder());
    dispatch(getOrderByNumberApiAsync(orderId));

    return () => {
      if (isModal) {
        dispatch(ordersSlice.actions.clearOrder());
      }
    };
  }, [dispatch, orderId, isModal]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || loading) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} isModal={isModal} />;
});
