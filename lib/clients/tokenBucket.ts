/**
 * X  x  x xxxx x x   xx x    x  x     x       x   x    x   x |NOW
 * xs = epochtimes
 *
 * can add TTL to the Xs
 * or can use a keyHash based on the account/resource/timeOfDay
 * and expire whole blocks when no longer reachable
 *
 * look back window size = now-windowSize
 * filter (xs > now-windowSize)
 * calls allowed - bucket size
 * per account
 *
 * - events go into which bucket
 * - consider: non-blocking event propogation EVENT -> SNS -> [Kinesis, SQS]?
 * - Use a function decorator to wrap the function with a tokenBucket check?
 * - Function decorator would need to know how to compose keyIDs, bucket size, and fill rate.
 * + config data on where the network-backed data store is...
 */
