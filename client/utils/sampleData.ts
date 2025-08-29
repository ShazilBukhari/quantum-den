import { ResumeData } from '@/types/resume';

export const getSampleResumeData = (): ResumeData => {
  return {
    contact: {
      fullName: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'https://sarahchen.dev',
      linkedin: 'linkedin.com/in/sarahchen',
      summary: 'Passionate software engineer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies. Led development teams and delivered high-impact projects that improved user engagement by 40%. Seeking to leverage technical skills and leadership experience in a senior engineering role.'
    },
    education: [
      {
        id: '1',
        school: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2018',
        endDate: '2022',
        gpa: '3.8',
        highlights: [
          'Magna Cum Laude',
          'Dean\'s List for 6 semesters',
          'Computer Science Honor Society'
        ]
      }
    ],
    experience: [
      {
        id: '1',
        company: 'TechCorp Inc.',
        position: 'Senior Software Engineer',
        startDate: 'Jan 2023',
        endDate: 'Present',
        location: 'San Francisco, CA',
        achievements: [
          'Led development of a microservices architecture serving 1M+ daily users',
          'Improved application performance by 35% through code optimization and caching strategies',
          'Mentored 3 junior developers and established code review best practices',
          'Collaborated with product team to deliver 5 major features ahead of schedule'
        ]
      },
      {
        id: '2',
        company: 'StartupXYZ',
        position: 'Software Engineer',
        startDate: 'Jun 2022',
        endDate: 'Dec 2022',
        location: 'Palo Alto, CA',
        achievements: [
          'Built responsive web applications using React, TypeScript, and Node.js',
          'Implemented automated testing suite that reduced bugs by 25%',
          'Designed and developed RESTful APIs serving mobile and web clients',
          'Participated in agile development process and daily standups'
        ]
      }
    ],
    projects: [
      {
        id: '1',
        name: 'E-Commerce Platform',
        description: 'Full-stack e-commerce application with payment integration, inventory management, and admin dashboard.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'AWS'],
        link: 'https://github.com/sarahchen/ecommerce-platform',
        highlights: [
          'Processed over $100k in transactions during first month',
          'Implemented secure payment processing with Stripe',
          'Built real-time inventory tracking system',
          'Deployed on AWS with auto-scaling capabilities'
        ]
      },
      {
        id: '2',
        name: 'Task Management App',
        description: 'Collaborative project management tool with real-time updates and team collaboration features.',
        technologies: ['Vue.js', 'Express.js', 'PostgreSQL', 'Socket.io'],
        link: 'https://github.com/sarahchen/task-manager',
        highlights: [
          'Real-time collaboration for teams up to 50 members',
          'Integrated with popular calendar applications',
          'Built comprehensive reporting and analytics dashboard'
        ]
      },
      {
        id: '3',
        name: 'Weather Analytics Dashboard',
        description: 'Data visualization platform for weather patterns and climate analysis using machine learning.',
        technologies: ['Python', 'TensorFlow', 'D3.js', 'Flask', 'PostgreSQL'],
        link: 'https://github.com/sarahchen/weather-analytics',
        highlights: [
          'Analyzed 10+ years of weather data using machine learning',
          'Created interactive visualizations with 95% accuracy predictions',
          'Presented findings at regional data science conference'
        ]
      }
    ],
    skills: [
      {
        category: 'Programming Languages',
        items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'SQL']
      },
      {
        category: 'Frontend Technologies',
        items: ['React', 'Vue.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Next.js']
      },
      {
        category: 'Backend Technologies',
        items: ['Node.js', 'Express.js', 'Flask', 'Django', 'PostgreSQL', 'MongoDB']
      },
      {
        category: 'Cloud & DevOps',
        items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Linux']
      },
      {
        category: 'Tools & Others',
        items: ['Figma', 'Jira', 'Slack', 'Postman', 'Jest', 'Cypress']
      }
    ]
  };
};

export const getEmptyResumeData = (): ResumeData => {
  return {
    contact: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      summary: ''
    },
    education: [],
    experience: [],
    projects: [],
    skills: []
  };
};
