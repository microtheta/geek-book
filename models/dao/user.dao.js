import models from '../index';

const Users = models.Users;
const UserCredentials = models.UserCredentials;


export const saveCredentials = (user) => (
  UserCredentials.upsert(user)
);

export const create = (userObj) => (
  Users.build(userObj).save()
);

export const getPassword = (userid) => (
  UserCredentials.findOne({
    where: {
      userId: userid
    }
  })
);

export const validateActivationToken = (token, userid) => (
  UserCredentials.findOne({
    where: {
      activationToken: token,
      userId: userid,
      activationTokenExpired: false
    }
  })
);

export const validatePasswordResetToken = (token, userid) => (
  UserCredentials.findOne({
    where: {
      passwordResetToken: token,
      userId: userid,
      passwordResetTokenExpired: false
    }
  })
);


export const activateAccount = (userid) => {
  const updateUsers = Users.update({
    isEmailVerified: true,
    isActive: true
  }, {
    where: {
      id: userid
    }
  });

  updateUsers.then(() => {
    UserCredentials.update({
      activationTokenExpired: true
    }, {
      where: {
        userId: userid
      }
    });
  });

  return updateUsers;
};

export const findById = (id) => (
  Users.findOne({
    where: { id }
  })
);

export const findByEmail = (email) => (
  Users.findOne({
    where: {
      email
    }
  })
);

export const findAll = () => (
  Users.findAll()
);
