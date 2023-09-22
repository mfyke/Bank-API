const router = require('express').Router();
const userRoutes = require('./user-routes');
const accountRoutes = require('./account-routes');
const transactionRoutes = require('./transaction-routes');
const interestRoutes = require('./interest-routes');

router.use('/users', userRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/interest', interestRoutes);

module.exports = router;
