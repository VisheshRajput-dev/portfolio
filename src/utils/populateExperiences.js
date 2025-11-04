import { addExperience } from '../firebase/database';

// Default experiences to populate Firebase
const defaultExperiences = [
  {
    company: "Freelance Developer",
    position: "Full-Stack & Mobile Developer",
    startDate: new Date('2024-01-01'),
    endDate: null,
    location: "Remote",
    description: "Delivered multiple production-ready web and mobile applications for startups and individuals, specializing in rapid MVP delivery. Combined strong coding fundamentals with AI-assisted workflows using ChatGPT, Gemini, Copilot, and n8n to accelerate development and automation.",
    technologies: ["React.js", "Node.js", "Flutter", "MongoDB", "Firebase", "Tailwind CSS", "Razorpay", "OpenAI API"],
    highlights: [
      "Delivered 3+ projects for clients within 2-week timelines",
      "Implemented full-stack systems with authentication, payments, and dashboards",
      "Used AI tools to boost development speed by 40%",
      "Successfully managed entire development lifecycle independently"
    ],
    current: true
  },
  {
    company: "Navadurga (Contract Project)",
    position: "Full-Stack Developer",
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-03-31'),
    location: "Remote",
    description: "Built a complete full-stack web portal for Navadurga Pvt. Ltd. to manage and analyze internal business data. Developed a secure admin dashboard with full CRUD functionality, real-time reporting, and data visualization to track customer insights and performance metrics. Integrated Firebase for backend services, Cloudinary for media management, and implemented automated workflows for smoother data handling and decision-making.",
    technologies: ["React.js", "Firebase", "Tailwind CSS", "Cloudinary", "Postman", "Google Stitch"],
    highlights: [
      "Architected a scalable admin panel with full CRUD operations",
      "Implemented interactive dashboards to visualize sales and customer trends",
      "Integrated Firebase and Cloudinary for secure data and media management",
      "enhanced ui design using Google Stitch and API-based pipelines",
      "Delivered a robust, production-ready system within 2 months of contract initiation"
    ],
    current: false
  },
  {
    company: "E-GameBazzi (Independent Project)",
    position: "Founder & Full-Stack Developer",
    startDate: new Date('2025-08-01'),
    endDate: new Date('2025-09-30'),
    location: "Remote",
    description: "Designed and built a fantasy esports platform prototype for games like BGMI, COD, and Valorant. Developed secure authentication, wallet management, and team selection systems using React, Node, and Firebase. Project is disband due to legal issues.",
    technologies: ["React.js", "Node.js", "MongoDB", "postman", "express", "firebase", "Razorpay", "Tailwind CSS"],
    highlights: [
      "Engineered a scalable backend with dynamic contest system using express and node.js",
      "Integrated Razorpay for wallet and payment management",
      "Created admin panels for KYC, prize distribution, and match results using react and tailwind css"
    ],
    current: false
  },
  {
    company: "Open Source & AI Experiments",
    position: "AI Developer (Self-Learning Projects)",
    startDate: new Date('2025-10-01'),
    endDate: null,
    location: "Remote",
    description: "Explored AI integrations and workflow automation using OpenAI, Gemini, and n8n. Built tools like a meeting summarizer app, data analysis assistant, and smart automation pipelines connecting APIs and databases.",
    technologies: ["Flutter", "Python", "Firebase", "OpenAI API", "n8n", "Gemini API", "Tailwind CSS", "React.js", "Node.js", "MongoDB", "postman", "express", "firebase", "Razorpay"],
    highlights: [
      "Integrated multilingual NLP features for productivity tools using openai api",
      "Created custom n8n workflows for automation and data syncing using n8n"
    ],
    current: true
  }
];

// Function to populate Firebase with default experiences
export const populateExperiences = async () => {
  try {
    console.log('Starting to populate experiences...');
    
    for (const experience of defaultExperiences) {
      const result = await addExperience(experience);
      if (result.success) {
        console.log(`✅ Added experience: ${experience.position} at ${experience.company}`);
      } else {
        console.error(`❌ Failed to add experience: ${experience.position}`, result.error);
      }
    }
    
    console.log('✅ All experiences populated successfully!');
  } catch (error) {
    console.error('❌ Error populating experiences:', error);
  }
};

// Function to check if experiences exist and populate if needed
export const initializeExperiences = async () => {
  try {
    const { getExperiences } = await import('../firebase/database');
    const existingExperiences = await getExperiences();
    
    if (existingExperiences.length === 0) {
      console.log('No experiences found, populating with default data...');
      await populateExperiences();
    } else {
      console.log(`Found ${existingExperiences.length} existing experiences`);
    }
  } catch (error) {
    console.error('Error initializing experiences:', error);
  }
};
