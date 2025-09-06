import { useNavigate } from 'react-router-dom';
import React, { ReactNode, useCallback } from 'react';
import { Modal } from '@components';

export function ModalWithNavigation(props: {
  title?: string;
  children?: ReactNode;
}) {
  let { title, children } = props;
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    // Очищаем состояние и возвращаемся назад
    navigate(-1);
  }, [navigate]);

  return (
    <Modal title={title} onClose={handleClose}>
      {children}
    </Modal>
  );
}
