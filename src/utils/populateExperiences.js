import { addExperience } from '../firebase/database';

// Default experiences to populate Firebase
const defaultExperiences = [
  {
    company: "PointsFly Technologies Private Limited",
    position: "Founding Engineer",
    startDate: new Date('2025-12-01'),
    endDate: null,
    location: "Onsite, Noida",
    description: "Building the PointsFly website, mobile application, and AIRA from scratch. The product helps users understand the rupee value of their credit card points, compare flight and hotel redemption options across major travel programs, manage multiple cards, and discover where nearby rewards can actually be used. AIRA is positioned as an autonomous rewards assistant for India's emerging fin-travel space.",
    technologies: ["Next.js", "Node.js", "Express.js", "MongoDB", "AWS", "Clerk", "React Native", "REST APIs"],
    highlights: [
      "Leading end-to-end product engineering for the website, app, and core rewards platform",
      "Built flows that calculate credit card point value and surface practical redemption choices",
      "Worked on travel reward discovery covering flights, hotels, nearby merchant usage, and card management",
      "Helped shape AIRA as an AI-driven rewards assistant in the fin-travel category"
    ],
    current: true
  },
  {
    company: "Freelance Developer",
    position: "Full-Stack & Mobile Developer",
    startDate: new Date('2024-01-01'),
    endDate: null,
    location: "Remote",
    description: "Built and shipped production-ready web and mobile apps for startups and independent clients, with a strong focus on fast MVP delivery. I combined solid engineering fundamentals with practical automation to move quicker without turning the product into a mess.",
    technologies: ["React.js", "Node.js", "Flutter", "MongoDB", "Firebase", "Tailwind CSS", "Razorpay", "OpenAI API"],
    highlights: [
      "Delivered 3+ projects for clients within 2-week timelines",
      "Implemented full-stack systems with authentication, payments, and dashboards",
      "Used modern tooling and automation to speed up delivery without cutting corners",
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
      "Delivered a production-ready internal system within two months of the contract kickoff"
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
    company: "Open Source and Automation Experiments",
    position: "Builder, Researcher, and Self-Directed Learner",
    startDate: new Date('2025-10-01'),
    endDate: null,
    location: "Remote",
    description: "Explored AI integrations and workflow automation with OpenAI, Gemini, and n8n. Built tools such as a meeting summarizer, a data analysis assistant, and automation flows that connect APIs with internal data.",
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
