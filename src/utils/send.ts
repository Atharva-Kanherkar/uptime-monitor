import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { sendEmail } from './email'; // Assuming you have a function to send emails

const prisma = new PrismaClient();

export async function monitorWebsites() {
  console.log("Function invoked");
  try {
    // Retrieve all users with their websites
    const users = await prisma.user.findMany({
      include: {
        website: true, 
      },
    });
  
  console.log(users);
    for (const user of users) {
      // Iterate through each website of the user
        try {
          // Check website status
          if (user.website?.url) {
            const response = await axios.get(user.website.url);
            console.log(response.status)
          if (response.status != 200) {
            // Website is down, send email alert
            await sendEmail(user.email, 'Website Down Alert', `Your website ${user.website.url} is down.`);
          }
          }

        } catch (error : unknown) {
          // Handle request error or timeout
          console.error(`Error checking ${user.website?.url}:`, (error as Error).message);
          // Optionally log this error or handle it based on your application's needs
        }
      }
 
  } catch (error : unknown) {
    console.error('Error retrieving users or websites:', (error as Error).message);
    // Handle database query errors or other critical errors
  }
}
 
setInterval(monitorWebsites, 60 * 1000); // Run every hour

// // Alternatively, use a scheduler library like node-cron or node-schedule to run at specific times or intervals
