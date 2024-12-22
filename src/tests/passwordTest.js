const bcrypt = require('bcrypt');

const password = '123456'; // The password entered by the user
const storedHashedPassword = '$2b$10$NZfX2ZuiU5uBqvU4HnJ2IuWK8jISyXbCOQaILox3Au9GrvfXum1iO'; // Hash stored in the database

// Manually comparing hashed password with input password
bcrypt.compare(password, storedHashedPassword).then(isMatch => {
  if (isMatch) {
    console.log('Passwords match');
  } else {
    console.log('Passwords do not match');
    console.log('Input password:', password);
    console.log('Stored hash:', storedHashedPassword);
  }
}).catch(error => {
  console.error('Error comparing passwords:', error);
});
