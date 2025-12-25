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
    description: '1st Place McMaster CAD Hackathon - Amphibious drone designed in 24 hours.',
    long_description: 'Placed First Place at McMaster CAD Hackathon. Performed a needs analysis and broke the complex design problem into its first principles. Modeled the drone in SolidWorks with proper tolerances taking DFM with various manufacturing methods into account. Improved propeller thrust in multiple fluids using SolidWorks CFD leading to a 50% maximum fluid velocity increase.',
    category: 'robotics',
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
    technologies: ['SolidWorks', 'Thermal Analysis', 'Sheet Metal Design', 'Safety Systems', 'CSA Standards'],
    github_url: '',
    live_url: 'https://drive.google.com/file/d/1m1IzAMV5LnMqfWALtT9YDCRQs69WKFQQ/view',
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
    long_description: 'Designed a cost-effective system under $300 to autonomously move Benchies from the pickup area to the drop-off area while maximizing throughput with a target of >30 Benchies and minimizing the number of prime movers (#Motors<4). Designed and integrated the complete electronic control subsystem using nMOS switching, employing gate and pull-down resistors for reliable state control and flyback diodes for inductive spike protection. Developed C++ firmware implementing state-machine logic where limit switches serve as the primary triggers for electromagnet actuation, integrating important safety overrides for E-stop and start/stop inputs. Achieved ±17.5mm positional tolerance (surpassing the ±7.5mm requirement), >5 cycles reliability without dropping a Benchy, and zero electrical disconnects throughout the demonstration phase.',
    category: 'robotics',
    image_url: '/projects/pickplace-1.png',
    images: [
      '/projects/pickplace-1.png',
      '/projects/pickplace-2.png',
      '/projects/pickplace-3.png',
      '/projects/pickplace-4.png',
      '/projects/pickplace-5.png',
    ],
    technologies: ['C++ Firmware', 'Arduino', 'Circuit Design', 'nMOS Control', 'State Machine Logic', '3D Printing', 'DFM'],
    github_url: '',
    live_url: '',
    featured: true,
    year: '2025',
    created_date: '2025-11-30',
  },
  {
    id: '6',
    title: '40:1 Strain Wave Gear Design',
    description: 'High-reduction ratio strain wave gear with FEA analysis and tolerance optimization.',
    long_description: 'Designed and analyzed a strain wave gear mechanism achieving high reduction ratios for precision robotics applications. Performed comprehensive finite element analysis (FEA) in Ansys to evaluate stress distribution, deflection patterns, and fatigue life under cyclic loading conditions. Optimized gear tooth profiles and wave generator geometry to minimize backlash while maintaining structural integrity. Conducted tolerance stack-up analysis to ensure manufacturability and assembly requirements. The design demonstrates efficient torque transmission with minimal size and weight, ideal for compact robotic actuators.',
    category: 'mechanical',
    image_url: '/projects/strainwavegear-1.png',
    images: [
      '/projects/strainwavegear-1.png',
      '/projects/strainwavegear-2.mp4',
    ],
    technologies: ['SolidWorks', 'Ansys FEA', 'Gear Design', 'Tolerance Analysis', 'Mechanical Design'],
    github_url: '',
    live_url: '',
    featured: true,
    year: '2025',
    created_date: '2025-10-15',
  },
  {
    id: '7',
    title: 'Aerodynamic Analysis, Modeling, and Optimization of a Frisbee',
    description: 'Research paper analyzing aerodynamics and biomechanics to optimize frisbee throwing distance and accuracy.',
    long_description: 'Developed a comprehensive 6-Degree-of-Freedom (6-DOF) flight simulation model to analyze the trajectory of a frisbee and optimize throwing parameters for maximum distance.',
    category: 'Research',
    image_url: '/projects/frisbee-1.png',
    images: [
      '/projects/frisbee-1.png',
      '/projects/frisbee-2.png',
    ],
    technologies: ['MATLAB', 'CFD Analysis', 'Biomechanics', 'Data Analysis', 'Mathematical Modeling', 'Research'],
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
    category: 'robotics',
    image_url: '/projects/drone-1.png',
    images: [
      '/projects/drone-1.png',
      '/projects/drone-2.png',
    ],
    technologies: ['SolidWorks', 'Xfoil', 'OpenVSP', 'Ansys Fluent', 'FDM 3D Printing', 'CFD'],
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
    long_description: 'Conducted experimental aerodynamic analysis of a drone airfoil using wind tunnel testing and advanced flow visualization techniques. Performed smoke flow visualization to observe boundary layer behavior, flow separation, and vortex formation at different angles of attack and Reynolds numbers. Measured lift and drag forces using strain gauge load cells and analyzed pressure distribution across the airfoil surface. Compared experimental results with CFD simulations to validate computational models. The study provided critical insights into airfoil performance characteristics and stall behavior, informing design decisions for optimal flight performance.',
    category: 'Research',
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
