import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { sendEmail } from './email'; // Assuming you have a function to send emails

const prisma = new PrismaClient();

async function monitorWebsites() {
  try {
    // Retrieve all users with their websites
    const users = await prisma.user.findMany({
    });
    const user = await prisma.user.findUnique(
        {
            where: { id: "rei" },
        }
    );
    user.
    // Iterate through each user
//     for (const user of users) {
//       // Iterate through each website of the user
//       for (const website of user.) {
//         try {
//           // Check website status
//           const response = await axios.get(website.url);

//           if (response.status == 200) {
//             // Website is down, send email alert
//             await sendEmail(user.email, 'Website Down Alert', `Your website ${website.url} is down.`);
//           }
//         } catch (error) {
//           // Handle request error or timeout
//           console.error(`Error checking ${website.url}:`, error.message);
//           // Optionally log this error or handle it based on your application's needs
//         }
//       }
//     }
  } catch (error) {
    console.error('Error retrieving users or websites:', error.message);
    // Handle database query errors or other critical errors
  }
}

// // Example: Run monitoring every hour
// setInterval(monitorWebsites, 60 * 1000); // Run every hour

// // Alternatively, use a scheduler library like node-cron or node-schedule to run at specific times or intervals
