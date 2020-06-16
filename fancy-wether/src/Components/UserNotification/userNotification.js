/* eslint-disable linebreak-style */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Button, Header, Icon, Modal,
} from 'semantic-ui-react';

const UserNotification = ({ userNotification, isModalClose }) => {
  const [isModalActive, setModalActive] = useState(false);
  useEffect(() => {
    setModalActive(userNotification.status);
  }, [userNotification]);
  const onClick = () => {
    isModalClose(true);
  };

  return (
    <Modal open={isModalActive} basic size="small">
      <Header
        icon="archive"
        content={userNotification?.header === undefined ? 'Something was wrong...' : userNotification?.header}
      />
      <Modal.Content>
        <pre>{userNotification.message}</pre>
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" inverted onClick={onClick}>
          <Icon name="checkmark" />
          {' '}
          Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

UserNotification.propTypes = {
  userNotification: PropTypes.shape({
    header: PropTypes.string,
    message: PropTypes.string,
    status: PropTypes.bool,
  }),
  isModalClose: PropTypes.func,
};

UserNotification.defaultProps = {
  userNotification: {
    header: 'Something was wrong...',
    message: '',
    status: false,
  },
  isModalClose: () => {},
};

export default UserNotification;
