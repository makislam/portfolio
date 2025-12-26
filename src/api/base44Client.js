// Base44 API Client Stub
// Portfolio projects for Makis Lam

// To add images:
// 1. Create folder: public/projects/
// 2. Add images like: public/projects/printbnb-1.jpg, public/projects/printbnb-2.jpg
// 3. Reference as: /projects/printbnb-1.jpg (no 'public' in path)

const sampleProjects = [
  {
    id: '1',
    title: 'All-Terrain Racing Drone',
    description: '1st Place McMaster CAD Hackathon - Multi-terrain drone designed in 24 hours.',
    long_description: 'Placed First Place at McMaster CAD Hackathon. Performed a needs analysis and broke the complex design problem into its first principles. Modeled the drone in SolidWorks with proper tolerances taking DFM with various manufacturing methods into account. Improved propeller thrust in multiple fluids using SolidWorks CFD leading to a 50% maximum fluid velocity increase.',
    category: 'mechanical',
    image_url: '/projects/hackathon-1.png',
    images: [
      '/projects/hackathon-1.png',
      '/projects/hackathon-2.png',
      '/projects/hackathon-3.png',
      '/projects/hackathon-4.png',
    ],
    technologies: ['SolidWorks', 'CFD Simulation', 'DFM', 'Rapid Prototyping', 'First Principles Design'],
    github_url: '',
    live_url: 'https://docs.google.com/presentation/d/10ddg0rZ24lKLttoYkT8ygaYKgf0rQnVjdlORni96CCE/edit#slide=id.g1f1939e120b_1_37',
    featured: true,
    year: '2023',
    created_date: '2023-02-10',
  },
  {
    id: '2',
    title: 'Waterloo Rocketry - Modular Curing Oven',
    description: 'Redesigned ducting system with pitot-static safety integration for CSA certification.',
    long_description: 'Redesigned the ducting system of the curing oven to reduce air bleed and increase heat retention. Designed and integrated a pitot-static safety system that monitored airflow within the ducting system and controlled the heater. Spearheaded the Canadian Standards Association (CSA) upgrades to meet certification standards.',
    category: 'mechanical',
    image_url: '/projects/rocketry-1.png',
    images: [
      '/projects/rocketry-1.png',
      '/projects/rocketry-2.png',
      '/projects/rocketry-3.png',
      '/projects/rocketry-4.png',
      '/projects/rocketry-5.png',
      '/projects/rocketry-6.png',
    ],
    video_url: '/projects/rocketry-video.mp4',
    technologies: ['SolidWorks', 'Thermal Analysis', 'Sheet Metal Design', 'Safety Systems', 'CSA Standards'],
    github_url: '',
    live_url: '',
    featured: true,
    year: '2023',
    created_date: '2023-04-20',
  },
  {
    id: '3',
    title: 'printbnb',
    description: 'Co-founded a 3D printing marketplace connecting users with local printer operators.',
    long_description: 'Co-founded and led a company of 7 engineers to create a website/network tackling the problem of 3D printing accessibility. Developed ordering, chat, and dashboard features in ReactJS, Tailwind, and Firebase, streamlining the process for users to order and receive 3D-printed parts. Directed team scope, schedule, and priorities to maximize resource efficiency and meet stakeholder objectives.',
    category: 'software',
    image_url: '/projects/printbnb-1.png',
    images: [
      '/projects/printbnb-1.png',
      '/projects/printbnb-2.png',
      '/projects/printbnb-3.png',
      '/projects/printbnb-4.png',
      '/projects/printbnb-5.png',
      '/projects/printbnb-6.png',
    ],
    technologies: ['ReactJS', 'Tailwind CSS', 'Firebase', 'Product Management'],
    github_url: '',
    live_url: 'https://printbnb.ca/',
    featured: true,
    year: '2025',
    created_date: '2025-11-01',
  },
  {
    id: '4',
    title: '"That Thang" - Pick and Place Robot',
    description: 'Cost-effective autonomous pick and place system with custom electronics and state-machine firmware.',
    long_description: 'Designed a cost-effective system under $300 to autonomously move Benchies from the pickup area to the drop-off area while maximizing throughput with a target of >30 Benchies and minimizing the number of prime movers. Designed and integrated the complete electronic control subsystem using nMOS switching, employing gate and pull-down resistors for reliable state control and flyback diodes for inductive spike protection. Developed firmware implementing state-machine logic where limit switches serve as the primary triggers for electromagnet actuation, integrating important safety overrides for E-stop and start/stop inputs.',
    category: 'robotics',
    image_url: '/projects/380-1.png',
    images: [
      '/projects/380-1.png',
      '/projects/380-2.png',
      '/projects/380-3.png',
      '/projects/380-4.png',
      '/projects/380-5.png',
    ],
    video_url: '/projects/380-video.mp4',
    technologies: ['Arduino', 'Circuit Design', 'nMOS Control', 'Electronic Selection', 'State Machine Logic', '3D Printing', 'DFM'],
    github_url: '',
    live_url: '',
    featured: true,
    year: '2025',
    created_date: '2025-11-30',
  },
  {
    id: '6',
    title: '40:1 Strain Wave Gear Design',
    description: 'High-reduction ratio strain wave gear design optimized for 3D printing.',
    long_description: 'Designed a strain wave gear mechanism achieving high reduction ratios for robotics applications. Analayzed the system to reduce friction and increase efficiency of the gearbox.',
    category: 'robotics',
    image_url: '/projects/strainwavegear-1.png',
    images: [
      '/projects/strainwavegear-1.png',
    ],
    video_url: '/projects/strainwavegear-2.mp4',
    technologies: ['SolidWorks', 'Gear Design', 'Tolerance Analysis', 'Mechanical Design'],
    github_url: '',
    live_url: '',
    featured: true,
    year: '2025',
    created_date: '2025-10-15',
  },
  {
    id: '7',
    title: 'Aerodynamic Analysis, Modeling, and Optimization of a Frisbee',
    description: 'Research paper modeling frisbee aerodynamics, analyzing forces to optimize frisbee throwing distance.',
    long_description: 'Developed a comprehensive 6-Degree-of-Freedom (6-DOF) flight simulation model to analyze the trajectory of a frisbee and optimize throwing parameters for maximum distance.',
    category: 'research',
    image_url: '/projects/frisbee-1.png',
    images: [
      '/projects/frisbee-1.png',
      '/projects/frisbee-2.png',
    ],
    technologies: ['Python', 'Fluid and Mathematical Modeling', 'Literature Review', 'Research'],
    github_url: '',
    live_url: '/projects/frisbee-paper.pdf',
    featured: false,
    year: '2025',
    created_date: '2025-11-30',
  },
  {
    id: '5',
    title: '"28:19" - 3D Printed Fixed Wing Drone',
    description: 'Autonomous FDM printed drone with aerodynamic analysis and structural optimization.',
    long_description: 'Researched and developed an autonomous FDM printed drone using SolidWorks. Performed low-fidelity analysis with Xfoil, OpenVSP, and Fluent on different airfoils to calculate lift and drag coefficients, achieving the maximum gross weight. Engineered the internal structure for an optimized strength-to-weight ratio and verified the design under realistic sample loads through structural analysis in Ansys. Next steps: Make the drone autonomous.',
    category: 'mechanical',
    image_url: '/projects/drone-1.png',
    images: [
      '/projects/drone-1.png',
      '/projects/drone-2.png',
    ],
    technologies: ['SolidWorks', 'CFD', 'FDM 3D Printing', 'Ansys FEA', 'Aerodynamic Analysis'],
    github_url: '',
    live_url: '',
    featured: true,
    year: '2025',
    created_date: '2025-12-30',
  },
  {
    id: '8',
    title: 'Experimental Flow Visualization of a Drone Airfoil',
    description: 'Makeshift wind tunnel testing and flow visualization study of airfoil aerodynamics at various angles of attack.',
    long_description: 'Conducted experimental aerodynamic analysis of a drone airfoil using wind tunnel testing and elementary flow visualization techniques. Performed smoke flow visualization to observe boundary layer behavior, flow separation, and vortex formation at different angles of attack and Reynolds numbers. The study provided insights into airfoil performance characteristics and stall behavior, informing design decisions for optimal flight performance.',
    category: 'research',
    image_url: '/projects/flowviz-1.png',
    images: [
      '/projects/flowviz-1.png',
      '/projects/flowviz-2.png',
      '/projects/flowviz-3.png',
      '/projects/flowviz-4.png',
    ],
    technologies: ['Wind Tunnel Testing', 'Flow Visualization', 'Data Acquisition', 'Aerodynamics', 'Experimental Methods', 'Research'],
    github_url: '',
    live_url: '/projects/flowviz-paper.pdf',
    featured: false,
    year: '2025',
    created_date: '2025-10-15',
  },
  {
    id: '9',
    title: 'The Plunge',
    description: 'Toy design combining mechanical engineering with playful user experience.',
    long_description: 'Tasked by Spinmaster to design and develop an innovative toy concept focusing on user satisfaction. Taking mechanism inspiration from a pen and salad spinner, these concepts were applied to the wildly popular fidget spinner. The result was a toy that was satisfying to play with, offering the traditional joy of a fidget spinner, while also including the fun of a well tuned button that turns the fudget spinner. Toy was 3D printed and assembled by hand yielding lots of user interest.',
    category: 'mechanical',
    image_url: '/projects/Plunge-1.png',
    images: [
      '/projects/Plunge-1.png',
      '/projects/Plunge-2.png',
      '/projects/Plunge-3.png',
    ],
    video_url: '/projects/Plunge-video.mp4',
    technologies: ['SolidWorks', 'Prototyping', 'DFM', 'Toy Design', 'Product Design'],
    github_url: '',
    live_url: '',
    featured: false,
    year: '2025',
    created_date: '2022-12-01',
  },
  {
    id: '10',
    title: 'Joy Scroll',
    description: 'Web app designed to redirect attention from doom scrolling to meditating on the Psalms.',
    long_description: 'Developed a web application to help users break free from the endless cycle of doom scrolling on social media platforms like Instagram and TikTok. Joy Scroll provides a calming, intentional alternative by presenting the Psalms in a beautiful, scrollable format that encourages meditation and reflection. Created in ReactJS with use of the Unsplash API for the background images and Vercel for deployment. The app includes features for autoscrolling, listening out loud, saving Psalms, reading the entire Psalm, and sharing them without the need for an account.',
    category: 'software',
    image_url: '/projects/joyscroll-1.png',
    images: [
      '/projects/joyscroll-1.png',
    ],
    technologies: ['Web Development', 'React', 'UI/UX Design', 'Vercel'],
    github_url: '',
    live_url: 'https://joyscroll.vercel.app/',
    featured: false,
    year: '2025',
    created_date: '2025-10-01',
  },
];

export const base44 = {
  entities: {
    Project: {
      list: async (sortBy = '-created_date') => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Sort projects
        const sorted = [...sampleProjects].sort((a, b) => {
          const field = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy;
          const direction = sortBy.startsWith('-') ? -1 : 1;
          
          if (a[field] < b[field]) return -1 * direction;
          if (a[field] > b[field]) return 1 * direction;
          return 0;
        });
        
        return sorted;
      },
      
      get: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return sampleProjects.find(p => p.id === id);
      },
    },
  },
};
