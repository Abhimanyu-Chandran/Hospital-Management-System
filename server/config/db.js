import dns from 'node:dns';
import { connect } from 'mongoose';

// 1. Set Global DNS Servers
// This is REQUIRED for Atlas to find the SRV (cluster) records.
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
]);

const connectDB = async () => {
    try {
        const conn = await connect(process.env.MONGODB_URI, {
            // 2. Force IPv4 to avoid dual-stack delays
            family: 4,

            // 3. Custom Lookup Handler
            // This ensures the final connection ALSO uses your custom servers
            // instead of reverting to the system/OS default.
            lookup: (hostname, options, callback) => {
                dns.resolve4(hostname, (err, addresses) => {
                    if (err) {
                        return callback(err);
                    }
                    // Return the first found IP address
                    callback(null, addresses[0], 4);
                });
            }
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

export default connectDB;