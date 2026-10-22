const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_pfEk0iqOZ1jD@ep-quiet-violet-b4ysvvyv-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

const BRANCHES = [
  {
    id: 'br-cse',
    code: 'CSE',
    name: 'Computer Science and Engineering',
    short_name: 'CSE',
    association_name: 'Association of Computer Engineers',
    association_short: 'ACE',
    icon_name: 'Code2',
    faculty_advisor: 'Dr. V. Shankar, Professor and HoD CSE',
    student_president: 'K. Sai Ruthvik',
    contact_email: 'ace.cse@kitsw.ac.in',
    contact_phone: '+91 98480 12345',
    accent_color: '#1E40AF',
    bg_light_color: '#EFF6FF',
    description: 'Premier computing department driving systems programming, distributed architectures, and full-stack engineering since 1980.'
  },
  {
    id: 'br-csm',
    code: 'CSM',
    name: 'CSE - Artificial Intelligence and Machine Learning',
    short_name: 'CSM',
    association_name: 'AI and Neural Syndicate',
    association_short: 'AIMS',
    icon_name: 'Cpu',
    faculty_advisor: 'Dr. P. Niranjan, Professor and HoD CSM',
    student_president: 'Divya Reddy',
    contact_email: 'aims.csm@kitsw.ac.in',
    contact_phone: '+91 94401 23456',
    accent_color: '#6D28D9',
    bg_light_color: '#F5F3FF',
    description: 'Specializing in cognitive systems, deep neural architectures, edge computer vision, and autonomous agent design.'
  },
  {
    id: 'br-csd',
    code: 'CSD',
    name: 'CSE - Data Science',
    short_name: 'CSD',
    association_name: 'Data Science Guild',
    association_short: 'DSG',
    icon_name: 'Database',
    faculty_advisor: 'Dr. C. Srinivas, Associate Professor CSD',
    student_president: 'Tarun Varma',
    contact_email: 'dsg.csd@kitsw.ac.in',
    contact_phone: '+91 91234 56789',
    accent_color: '#0F766E',
    bg_light_color: '#F0FDFA',
    description: 'Focused on enterprise lakehouse architectures, distributed big data streams, predictive analytics, and statistical algorithms.'
  },
  {
    id: 'br-it',
    code: 'IT',
    name: 'Information Technology',
    short_name: 'IT',
    association_name: 'Information Technology Association',
    association_short: 'ITA',
    icon_name: 'Globe',
    faculty_advisor: 'Dr. T. Senthil Murugan, Professor IT',
    student_president: 'P. Harsha Vardhan',
    contact_email: 'ita.it@kitsw.ac.in',
    contact_phone: '+91 97000 88990',
    accent_color: '#0369A1',
    bg_light_color: '#F0F9FF',
    description: 'Leading innovations in cloud infrastructure, container orchestration, zero-trust cybersecurity, and enterprise systems.'
  },
  {
    id: 'br-ece',
    code: 'ECE',
    name: 'Electronics and Communication Engineering',
    short_name: 'ECE',
    association_name: 'Association of Electronics and Communication Engineers',
    association_short: 'AECE',
    icon_name: 'Radio',
    faculty_advisor: 'Dr. B. Rama Devi, Professor and HoD ECE',
    student_president: 'Sneha Rao',
    contact_email: 'aece.ece@kitsw.ac.in',
    contact_phone: '+91 98855 44332',
    accent_color: '#C2410C',
    bg_light_color: '#FFF7ED',
    description: 'Pioneering VLSI microchip architecture, 5G RF communications, embedded systems, and robotics hardware.'
  },
  {
    id: 'br-eee',
    code: 'EEE',
    name: 'Electrical and Electronics Engineering',
    short_name: 'EEE',
    association_name: 'Electrical Engineers Association',
    association_short: 'EEA',
    icon_name: 'Zap',
    faculty_advisor: 'Dr. G. Rajender, Professor and HoD EEE',
    student_president: 'Aditya Kashyap',
    contact_email: 'eea.eee@kitsw.ac.in',
    contact_phone: '+91 99887 66554',
    accent_color: '#B45309',
    bg_light_color: '#FFFBEB',
    description: 'Powering electric vehicle powertrains, lithium battery management, high-voltage substations, and green renewable grids.'
  },
  {
    id: 'br-mech',
    code: 'MECH',
    name: 'Mechanical Engineering',
    short_name: 'MECH',
    association_name: 'Mechanical Engineering Association',
    association_short: 'MEA',
    icon_name: 'Settings',
    faculty_advisor: 'Dr. K. Sridhar, Professor and Dean Mechanical',
    student_president: 'Manoj Kumar',
    contact_email: 'mea.mech@kitsw.ac.in',
    contact_phone: '+91 94900 11223',
    accent_color: '#334155',
    bg_light_color: '#F8FAFC',
    description: 'Excellence in generative aerospace optimization, computational fluid dynamics, CNC machining, and metal 3D printing.'
  },
  {
    id: 'br-civil',
    code: 'CIVIL',
    name: 'Civil Engineering',
    short_name: 'CIVIL',
    association_name: 'Civil Engineering Association',
    association_short: 'CEA',
    icon_name: 'Building2',
    faculty_advisor: 'Dr. M. Veera Reddy, Professor and Principal KITSW',
    student_president: 'Ananya Sharma',
    contact_email: 'cea.civil@kitsw.ac.in',
    contact_phone: '+91 93910 99887',
    accent_color: '#047857',
    bg_light_color: '#ECFDF5',
    description: 'Founding discipline of KITSW engineering, specializing in seismic-resilient tall structures, BIM modeling, and geotechnical integrity.'
  }
];

const ORGANIZERS = [
  { id: 'org-cse', branch_code: 'CSE', username: 'ace_cse', password_hash: 'samshodhani26', name: 'K. Sai Ruthvik', role: 'BRANCH_ADMIN' },
  { id: 'org-csm', branch_code: 'CSM', username: 'aims_csm', password_hash: 'samshodhani26', name: 'Divya Reddy', role: 'BRANCH_ADMIN' },
  { id: 'org-csd', branch_code: 'CSD', username: 'dsg_csd', password_hash: 'samshodhani26', name: 'Tarun Varma', role: 'BRANCH_ADMIN' },
  { id: 'org-it', branch_code: 'IT', username: 'ita_it', password_hash: 'samshodhani26', name: 'P. Harsha Vardhan', role: 'BRANCH_ADMIN' },
  { id: 'org-ece', branch_code: 'ECE', username: 'aece_ece', password_hash: 'samshodhani26', name: 'Sneha Rao', role: 'BRANCH_ADMIN' },
  { id: 'org-eee', branch_code: 'EEE', username: 'eea_eee', password_hash: 'samshodhani26', name: 'Aditya Kashyap', role: 'BRANCH_ADMIN' },
  { id: 'org-mech', branch_code: 'MECH', username: 'mea_mech', password_hash: 'samshodhani26', name: 'Manoj Kumar', role: 'BRANCH_ADMIN' },
  { id: 'org-civil', branch_code: 'CIVIL', username: 'cea_civil', password_hash: 'samshodhani26', name: 'Ananya Sharma', role: 'BRANCH_ADMIN' },
  { id: 'org-admin', branch_code: 'CSE', username: 'kitsw_convenor', password_hash: 'admin2026', name: 'Faculty Advisory Board', role: 'SUPER_ADMIN' },
];

const WORKSHOPS = [
  {
    id: 'ws-cse',
    slug: 'generative-ai-agentic-systems',
    branch_code: 'CSE',
    title: 'Generative AI and Autonomous Agentic Workflows with LangGraph',
    tagline: 'Engineering enterprise multi-agent workflows, vector retrieval pipelines, and fine-tuned LLMs',
    description: 'A deep immersion into production-ready transformer models, sliding window attention, hybrid sparse-dense vector retrieval, and cyclic multi-agent graph architecture.',
    poster_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    year_lead_name: 'K. Sai Ruthvik',
    year_lead_year: 'Lead Student Convener',
    year_lead_phone: '+91 98480 12345',
    year_lead_email: 'ruthvik.cse@kitsw.ac.in',
    year_lead_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    resource_person_name: 'Dr. Anandhan K. Ramanathan',
    resource_person_designation: 'Staff AI Research Scientist and GenAI Lead',
    resource_person_company: 'Microsoft Research India',
    resource_person_bio: 'Distinguished AI researcher with 18 US patents in transformer attention optimizations and autonomous multi-agent orchestration. Keynote speaker at NeurIPS and CVPR.',
    resource_person_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    resource_person_linkedin: 'https://linkedin.com/in/anandhan-ai-microsoft',
    resource_person_topics: JSON.stringify(['LangGraph Orchestration', 'Multi-Agent Tool Use', 'Hybrid Vector RAG Architectures', 'LLaMA-3 LoRA Quantized Fine-Tuning']),
    dates: 'March 12 and 13, 2026',
    time: '09:30 AM to 04:30 PM IST',
    venue: 'Silver Jubilee Hall and Block-IV Cisco Cloud Computing Center',
    fees: 'INR 450 per participant',
    max_capacity: 250,
    current_registered: 218,
    live_status: 'upcoming',
    prerequisites: JSON.stringify(['Python 3.x proficiency', 'Familiarity with REST APIs', 'Laptop with min 8GB RAM']),
    takeaways: JSON.stringify(['KITSW and Microsoft Partnered Certificate', 'Azure AI Developer Credits', 'Production GitHub repository template', 'Executive mentor interaction']),
    syllabus: JSON.stringify([
      { time: '09:30 AM - 11:30 AM', topic: 'Modern LLM Foundations and Attention Mechanics', description: 'Deconstructing modern tokenizers, positional encodings, sliding window attention, and quantized weights.' },
      { time: '11:45 AM - 01:15 PM', topic: 'Production RAG and Vector Lakehouses', description: 'Hybrid sparse-dense retrieval with Pinecone and pgvector, reranking models, and hallucination reduction.' },
      { time: '02:00 PM - 03:30 PM', topic: 'LangGraph and Autonomous Multi-Agent Swarms', description: 'Constructing cyclic state graphs where agents plan, debug code, call APIs, and self-reflect.' },
      { time: '03:45 PM - 04:30 PM', topic: 'Live Deployment and Hackathon Problem Brief', description: 'Packaging agents as FastAPI edge microservices and deploying on Docker with live streaming telemetry.' }
    ]),
    registration_url: 'https://forms.gle/sampleCSEGenAIWorkshop',
    google_form_url: 'https://docs.google.com/forms/d/e/sample-cse/viewform',
    report_pdf_url: '/archives/cse_workshop_report_2026.pdf'
  },
  {
    id: 'ws-csm',
    slug: 'autonomous-drone-swarms-ros2',
    branch_code: 'CSM',
    title: 'Autonomous Drone Swarms, Edge Vision and ROS 2 Orchestration',
    tagline: 'Deploy YOLO-v10 vision tracking and SLAM navigation on physical autonomous quadcopters',
    description: 'Hands-on hardware and flight robotics workshop covering ROS 2 Humble micro-nodes, TensorRT edge inference, and GPS-denied indoor 3D point-cloud mapping.',
    poster_url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80',
    year_lead_name: 'Divya Reddy',
    year_lead_year: 'Lead Student Convener',
    year_lead_phone: '+91 94401 23456',
    year_lead_email: 'divya.csm@kitsw.ac.in',
    year_lead_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    resource_person_name: 'Vikram Deshmukh',
    resource_person_designation: 'Head of Autonomous Systems and Flight Navigation',
    resource_person_company: 'Garuda Aerospace',
    resource_person_bio: 'Architect of tactical drone swarms for agricultural precision and defense surveillance. Recognized among Forbes 30 Under 30 in Robotics and Hardware.',
    resource_person_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    resource_person_linkedin: 'https://linkedin.com/in/vikram-deshmukh-drones',
    resource_person_topics: JSON.stringify(['ROS 2 Humble Architecture', 'YOLO-v10 Edge Inference', 'Visual Inertial Odometry and SLAM', 'Mesh Swarm Protocols']),
    dates: 'March 12 and 13, 2026',
    time: '09:30 AM to 04:30 PM IST',
    venue: 'Auditorium Quadrangle and CSM Neural Computing Lab',
    fees: 'INR 500 per participant',
    max_capacity: 200,
    current_registered: 192,
    live_status: 'upcoming',
    prerequisites: JSON.stringify(['Elementary C++ or Python', 'Interest in autonomous flying robotics']),
    takeaways: JSON.stringify(['Jetson Nano and PX4 flight controller programming', 'Drone Pilot Simulator credential', 'Internship fast-track interview opportunity']),
    syllabus: JSON.stringify([
      { time: '09:30 AM - 11:30 AM', topic: 'ROS 2 Micro-Nodes and Sensor Telemetry', description: 'Publishers, subscribers, services, and action servers for IMU, LiDAR, and optical sensors.' },
      { time: '11:45 AM - 01:15 PM', topic: 'Edge Vision Inference with TensorRT', description: 'Optimizing deep neural networks on NVIDIA Jetson for real-time aerial obstacle detection.' },
      { time: '02:00 PM - 03:30 PM', topic: 'Indoor 3D SLAM without GPS', description: 'Point cloud mapping and path planning algorithms using stereo camera depth streams.' },
      { time: '03:45 PM - 04:30 PM', topic: 'Live Outdoor Flight Demonstration', description: 'Coordinated 5-drone synchronized formation flight above KITSW campus grounds.' }
    ]),
    registration_url: 'https://forms.gle/sampleCSMDrones',
    google_form_url: 'https://docs.google.com/forms/d/e/sample-csm/viewform',
    report_pdf_url: '/archives/csm_workshop_report_2026.pdf'
  },
  {
    id: 'ws-csd',
    slug: 'modern-data-lakehouse-iceberg',
    branch_code: 'CSD',
    title: 'Enterprise Big Data Lakehouses and Real-Time Analytics with Apache Iceberg',
    tagline: 'Architecting petabyte-scale streaming pipelines with Apache Kafka, Spark, and Iceberg',
    description: 'Learn open table formats, ACID transactions on cloud object storage, streaming change-data-capture from relational databases, and microsecond analytical queries.',
    poster_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    year_lead_name: 'Tarun Varma',
    year_lead_year: 'Lead Student Convener',
    year_lead_phone: '+91 91234 56789',
    year_lead_email: 'tarun.csd@kitsw.ac.in',
    year_lead_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    resource_person_name: 'Swathi Sen',
    resource_person_designation: 'Principal Data Platform Architect',
    resource_person_company: 'Databricks',
    resource_person_bio: 'Apache Iceberg PMC contributor and veteran big data engineer who engineered real-time streaming feeds processing 40 million events per second.',
    resource_person_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    resource_person_linkedin: 'https://linkedin.com/in/swathi-sen-data',
    resource_person_topics: JSON.stringify(['Open Table Formats: Iceberg vs Delta Lake', 'Kafka Streaming to Parquet Partitioning', 'ACID Transactions on Object Storage', 'Trino Real-time Queries']),
    dates: 'March 13 and 14, 2026',
    time: '10:00 AM to 04:30 PM IST',
    venue: 'Block-II Data Engineering Seminar Hall',
    fees: 'INR 400 per participant',
    max_capacity: 180,
    current_registered: 165,
    live_status: 'upcoming',
    prerequisites: JSON.stringify(['Basic SQL query proficiency', 'Database fundamentals']),
    takeaways: JSON.stringify(['Data Architect digital credential', 'Databricks Academy voucher discounts', 'Cloud cluster sandbox access']),
    syllabus: JSON.stringify([
      { time: '10:00 AM - 12:00 PM', topic: 'Modern Open Table Formats Architecture', description: 'Why open table formats conquered Big Tech and how hidden metadata partitioning works.' },
      { time: '01:00 PM - 02:30 PM', topic: 'Building Real-time Kafka Pipelines', description: 'Streaming change-data-capture directly from PostgreSQL into cloud storage.' },
      { time: '02:45 PM - 04:30 PM', topic: 'Time-Travel Queries and Schema Evolution', description: 'Querying historical tables as of 30 days ago and evolving schemas safely.' }
    ]),
    registration_url: 'https://forms.gle/sampleCSDData'
  },
  {
    id: 'ws-it',
    slug: 'cloud-native-devops-kubernetes',
    branch_code: 'IT',
    title: 'Cloud-Native Kubernetes, Istio Service Mesh and Zero-Trust Architecture',
    tagline: 'From code commit to multi-region resilient deployment using GitOps and ArgoCD',
    description: 'Master container runtimes, Kubernetes pod scheduling, Istio mTLS mutual authentication, and chaos engineering simulations.',
    poster_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    year_lead_name: 'P. Harsha Vardhan',
    year_lead_year: 'Lead Student Convener',
    year_lead_phone: '+91 97000 88990',
    year_lead_email: 'harsha.it@kitsw.ac.in',
    year_lead_avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    resource_person_name: 'Nikhil Verma',
    resource_person_designation: 'Senior Principal Cloud Solutions Architect',
    resource_person_company: 'Amazon Web Services',
    resource_person_bio: 'Nikhil has guided top Fortune 500 enterprises through container modernization and high-security Zero-Trust compliance. Author of Pragmatic Kubernetes for Engineers.',
    resource_person_avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    resource_person_linkedin: 'https://linkedin.com/in/nikhil-verma-aws',
    resource_person_topics: JSON.stringify(['K8s Pod Scheduling and CNI Internals', 'Istio mTLS Traffic Encryption', 'ArgoCD Automated Continuous Delivery', 'Prometheus Observability']),
    dates: 'March 12 and 13, 2026',
    time: '09:30 AM to 04:30 PM IST',
    venue: 'IT Department Advanced Server Lab',
    fees: 'INR 400 per participant',
    max_capacity: 160,
    current_registered: 158,
    live_status: 'upcoming',
    prerequisites: JSON.stringify(['Linux command-line basics', 'Basic networking principles']),
    takeaways: JSON.stringify(['CKAD study roadmap', 'AWS Cloud promotional credits', 'Complete recorded lab guides']),
    syllabus: JSON.stringify([
      { time: '09:30 AM - 11:30 AM', topic: 'Docker Internals and Linux Cgroups', description: 'Under the hood of Linux kernel isolation and container runtimes.' },
      { time: '11:45 AM - 01:15 PM', topic: 'Kubernetes Cluster Architecture', description: 'etcd state, kube-apiserver, kube-scheduler, and custom resource definitions.' },
      { time: '02:00 PM - 04:30 PM', topic: 'Zero-Trust Istio Mesh and Chaos Testing', description: 'Simulating pod crashes, network partitioning, and automated self-healing.' }
    ]),
    registration_url: 'https://forms.gle/sampleITK8s'
  },
  {
    id: 'ws-ece',
    slug: 'vlsi-chip-design-riscv-silicon',
    branch_code: 'ECE',
    title: 'RISC-V Silicon Chip Tape-Out and FPGA VLSI Hardware Synthesis',
    tagline: 'Design, simulate, and synthesize custom RISC-V processor cores on Silicon and Xilinx FPGAs',
    description: 'Hardware description languages, 5-stage instruction pipelines, static timing analysis, and open-source ASIC flow with OpenLane targeting SkyWater 130nm process.',
    poster_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    year_lead_name: 'Sneha Rao',
    year_lead_year: 'Lead Student Convener',
    year_lead_phone: '+91 98855 44332',
    year_lead_email: 'sneha.ece@kitsw.ac.in',
    year_lead_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    resource_person_name: 'Dr. K. Radhakrishnan',
    resource_person_designation: 'Senior Director of Silicon Architecture',
    resource_person_company: 'Qualcomm Snapdragon Technologies',
    resource_person_bio: 'Dr. Radhakrishnan holds 24+ patents in low-power mobile processor microarchitectures and has led the tapeout of three flagship mobile Snapdragon SoCs.',
    resource_person_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    resource_person_linkedin: 'https://linkedin.com/in/radhakrishnan-qualcomm-silicon',
    resource_person_topics: JSON.stringify(['RISC-V 32-bit Core Microarchitecture', 'SystemVerilog RTL Synthesis', 'Static Timing Analysis', 'Open-Source ASIC Flow with OpenLane']),
    dates: 'March 12 and 13, 2026',
    time: '09:00 AM to 04:30 PM IST',
    venue: 'Block-II ECE Cadence VLSI Research Lab',
    fees: 'INR 450 per participant',
    max_capacity: 150,
    current_registered: 146,
    live_status: 'upcoming',
    prerequisites: JSON.stringify(['Digital electronics fundamentals', 'Boolean logic and state machines']),
    takeaways: JSON.stringify(['Synthesize 32-bit core on FPGA boards onsite', 'Qualcomm Silicon Design reference manual', 'SkyWater 130nm open shuttle submission opportunity']),
    syllabus: JSON.stringify([
      { time: '09:00 AM - 11:30 AM', topic: 'RISC-V Instruction Set and Pipeline Hazards', description: '5-stage pipeline design: Fetch, Decode, Execute, Memory, Write-back with forwarding.' },
      { time: '11:45 AM - 01:15 PM', topic: 'SystemVerilog RTL Coding and Testbench Verification', description: 'Writing robust assertions, test vectors, and functional coverage.' },
      { time: '02:00 PM - 04:30 PM', topic: 'ASIC Synthesis and GDSII Physical Layout', description: 'Floorplanning, placement, routing, clock tree synthesis, and GDSII generation.' }
    ]),
    registration_url: 'https://forms.gle/sampleECEVLSI'
  },
  {
    id: 'ws-eee',
    slug: 'ev-powertrains-bms-smart-grids',
    branch_code: 'EEE',
    title: 'Electric Vehicle Powertrains, Smart BMS and High-Voltage Grid Integration',
    tagline: 'Design Li-Ion cell thermal management, regenerative braking, and smart bidirectional charging',
    description: 'Comprehensive powertrain engineering from prismatic cell pack safety, extended Kalman filter SoC estimation, and dynamo test rigs to CAN bus telemetry.',
    poster_url: 'https://images.unsplash.com/photo-1558441719-8b489c652756?auto=format&fit=crop&w=1200&q=80',
    year_lead_name: 'Aditya Kashyap',
    year_lead_year: 'Lead Student Convener',
    year_lead_phone: '+91 99887 66554',
    year_lead_email: 'aditya.eee@kitsw.ac.in',
    year_lead_avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    resource_person_name: 'M. Rajeshwar',
    resource_person_designation: 'Head of Battery Engineering and Powertrain Systems',
    resource_person_company: 'Ather Energy',
    resource_person_bio: 'Pioneered high-density prismatic battery pack designs, thermal runaway arrest systems, and real-time state-of-charge estimation algorithms for over 300,000 electric vehicles.',
    resource_person_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    resource_person_linkedin: 'https://linkedin.com/in/rajeshwar-ather-ev',
    resource_person_topics: JSON.stringify(['Li-Ion Cell Chemistry and Degradation', 'Cell Balancing Circuits', 'PMSM Inverter Modulation', 'V2G Standards']),
    dates: 'March 13 and 14, 2026',
    time: '09:30 AM to 04:30 PM IST',
    venue: 'EEE Power Electronics and High Voltage Lab - Block III',
    fees: 'INR 400 per participant',
    max_capacity: 140,
    current_registered: 132,
    live_status: 'upcoming',
    prerequisites: JSON.stringify(['Basic circuit theory', 'Elementary understanding of electric machines']),
    takeaways: JSON.stringify(['Teardown experience with commercial EV packs', 'Matlab Powertrain model bundle', 'Ather Energy endorsed credential']),
    syllabus: JSON.stringify([
      { time: '09:30 AM - 11:30 AM', topic: 'Battery Pack Micro-Architecture and Safety', description: 'Thermal runaway prevention, fusible links, busbars, and immersion cooling methods.' },
      { time: '11:45 AM - 01:15 PM', topic: 'BMS Firmware and Extended Kalman Filter', description: 'Writing C code for accurate state of charge and state of health telemetry.' },
      { time: '02:00 PM - 04:30 PM', topic: 'Live Dynamo Rig Dyno Testing and CAN Bus Sniffing', description: 'Bench-testing a 15kW electric drive motor with regenerative braking capture.' }
    ]),
    registration_url: 'https://forms.gle/sampleEEEEV'
  },
  {
    id: 'ws-mech',
    slug: 'generative-design-additive-metal-3d',
    branch_code: 'MECH',
    title: 'Generative Aerospace Design and Metal 3D Additive Prototyping',
    tagline: 'Topology optimization, lattice structures, and direct metal laser sintering for aerospace components',
    description: 'Learn how generative algorithms and finite element structural simulations optimize aerospace components for extreme strength-to-weight ratios followed by live multi-axis metal 3D printing.',
    poster_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    year_lead_name: 'Manoj Kumar',
    year_lead_year: 'Lead Student Convener',
    year_lead_phone: '+91 94900 11223',
    year_lead_email: 'manoj.mech@kitsw.ac.in',
    year_lead_avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80',
    resource_person_name: 'T. Srinivas Rao',
    resource_person_designation: 'Senior Scientist and Head of Additive Aerospace Structures',
    resource_person_company: 'ISRO / National Remote Sensing Centre',
    resource_person_bio: 'Designed weight-optimized structural brackets and cryogenic propellant valves for Chandrayaan-3 and Gaganyaan missions using generative AI algorithms and titanium additive manufacturing.',
    resource_person_avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    resource_person_linkedin: 'https://linkedin.com/in/srinivas-rao-isro',
    resource_person_topics: JSON.stringify(['Topology Optimization with Altair', 'Lattice Infill Geometries', 'Direct Metal Laser Sintering Physics', 'Finite Element Structural Validation']),
    dates: 'March 12 and 13, 2026',
    time: '09:30 AM to 04:30 PM IST',
    venue: 'Advanced CNC Machining Center and Mechanical CAD Lab',
    fees: 'INR 450 per participant',
    max_capacity: 150,
    current_registered: 139,
    live_status: 'upcoming',
    prerequisites: JSON.stringify(['CAD software familiarity (SolidWorks, AutoCAD, or Fusion 360)']),
    takeaways: JSON.stringify(['Physical customized 3D printed model to keep', 'ISRO Scientist signed workshop credential', 'Aerospace design portfolio template']),
    syllabus: JSON.stringify([
      { time: '09:30 AM - 11:30 AM', topic: 'Generative Synthesis Algorithms and Constraints', description: 'Setting load cases, manufacturing restrictions, preserve geometry, and material targets.' },
      { time: '11:45 AM - 01:15 PM', topic: 'Ansys FEA Stress Validation', description: 'Von-Mises stress analysis, displacement contour maps, and factor-of-safety checks.' },
      { time: '02:00 PM - 04:30 PM', topic: 'Live Metal Slicing and High-Precision 3D Printing', description: 'Generating G-code, support structure design, and live execution on multi-axis 3D printers.' }
    ]),
    registration_url: 'https://forms.gle/sampleMECH3D'
  },
  {
    id: 'ws-civil',
    slug: 'bim-360-seismic-smart-structures',
    branch_code: 'CIVIL',
    title: 'Building Information Modeling (BIM 360) and Seismic-Resilient Megastructures',
    tagline: 'Parametric 4D/5D building modeling, digital twins, and earthquake response simulation',
    description: 'Transition from 2D drafting to intelligent 5D BIM digital twins, Navisworks clash coordination, and ETABS Zone-V earthquake load simulations with base isolator mechanics.',
    poster_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861563?auto=format&fit=crop&w=1200&q=80',
    year_lead_name: 'Ananya Sharma',
    year_lead_year: 'Lead Student Convener',
    year_lead_phone: '+91 93910 99887',
    year_lead_email: 'ananya.civil@kitsw.ac.in',
    year_lead_avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
    resource_person_name: 'Er. V. Ramanathan',
    resource_person_designation: 'Chief Structural Consultant and BIM Director',
    resource_person_company: 'Larsen and Toubro (L&T) Construction',
    resource_person_bio: 'Directed BIM modeling and structural dynamics for landmark infrastructure projects including metro rail systems, international airports, and 60-story skyscrapers across India and the Middle East.',
    resource_person_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    resource_person_linkedin: 'https://linkedin.com/in/ramanathan-lt-bim',
    resource_person_topics: JSON.stringify(['Autodesk Revit 2026 Structural BIM', 'Clash Detection with Navisworks', 'ETABS Seismic Response Analysis', 'Digital Twins and IoT Structural Sensors']),
    dates: 'March 13 and 14, 2026',
    time: '09:30 AM to 04:30 PM IST',
    venue: 'Civil Engineering Computer Applications Center - Block I',
    fees: 'INR 400 per participant',
    max_capacity: 140,
    current_registered: 125,
    live_status: 'upcoming',
    prerequisites: JSON.stringify(['Basic civil or architectural drawing concepts']),
    takeaways: JSON.stringify(['Autodesk BIM student certification credential', 'L&T vetted structural analysis reference guide', 'Practical modeling project for professional resumes']),
    syllabus: JSON.stringify([
      { time: '09:30 AM - 11:30 AM', topic: 'Modern BIM Workflows and Industry 4.0 Construction', description: 'Transitioning from 2D drafting to multidimensional intelligent models.' },
      { time: '11:45 AM - 01:15 PM', topic: 'Structural Modeling in Revit and Clash Coordination', description: 'Automated interference discovery between MEP ducts and structural beams.' },
      { time: '02:00 PM - 04:30 PM', topic: 'Seismic Base Isolation and Shaking Table Demo', description: 'Simulating Zone-V earthquake loads on high-rise models using ETABS and KITSW Shake Table.' }
    ]),
    registration_url: 'https://forms.gle/sampleCIVILBIM'
  }
];

const EVENTS = [
  {
    id: 'ev-cse-hackathon',
    slug: 'hack-the-future-24h',
    branch_code: 'CSE',
    title: 'HackTheFuture: 24-Hour National Hackathon',
    category: 'Hackathon',
    tagline: 'Code non-stop to solve real-world problems in HealthTech, EdTech, FinTech and Governance',
    description: 'The flagship national 24-hour hackathon challenging student engineers to build full-stack deployed MVPs with live jury reviews at midnight and the grand finals stage.',
    poster_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    junior_coordinators: JSON.stringify([
      { name: 'R. Akhil Reddy', role: 'Lead Student Convener', phone: '+91 98491 55667', email: 'akhil.cse@kitsw.ac.in', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
      { name: 'K. Bhavana', role: 'Operations Coordinator', phone: '+91 97012 33445', email: 'bhavana.cse@kitsw.ac.in', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' }
    ]),
    venue: 'Central Library Digital Learning Commons (Air Conditioned, 24x7 WiFi)',
    day: 'Day 2',
    time: '10:00 AM (Day 2) to 10:00 AM (Day 3)',
    prize_pool_first: 'INR 35,000',
    prize_pool_second: 'INR 20,000',
    prize_pool_third: 'INR 10,000',
    prize_pool_total: 'INR 65,000',
    team_size: '2 to 4 Members',
    current_registered: 184,
    max_slots: 200,
    status: 'upcoming',
    rules: JSON.stringify([
      'Teams must arrive with original student ID cards and laptops.',
      'All code must be committed to GitHub during the 24-hour window.',
      'Mentors will conduct 3 checkpoint reviews: Ideation, MVP Check, and Final Polish.'
    ]),
    rounds: JSON.stringify([
      { roundNumber: 1, name: 'Idea Validation and Pitch', description: '5-minute pitch of architecture, problem statement, and proposed technology stack.' },
      { roundNumber: 2, name: 'Midnight Code Checkpoint', description: 'Jury walkthrough of functioning core APIs, database schema, and live frontend preview.' },
      { roundNumber: 3, name: 'Grand Stage Pitching', description: 'Live onstage demo in front of venture capitalists and Microsoft tech leads.' }
    ]),
    registration_url: 'https://forms.gle/cseHackathon2026'
  },
  {
    id: 'ev-cse-code-sprint',
    slug: 'algo-frenzy-speed-coding',
    branch_code: 'CSE',
    title: 'AlgoFrenzy: Extreme Speed Coding Championship',
    category: 'Coding',
    tagline: 'High-speed competitive programming battles with blind coding rounds and sudden death twists',
    description: 'Solve complex algorithmic problems under tight time constraints. Round 2 features blind coding where monitors are turned off for the first 10 minutes.',
    poster_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    junior_coordinators: JSON.stringify([
      { name: 'V. Sravan', role: 'Technical Incharge', phone: '+91 98485 77889', email: 'sravan.cse@kitsw.ac.in', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }
    ]),
    venue: 'CSE Department Lab 1 and 2',
    day: 'Day 1',
    time: '01:30 PM to 04:30 PM',
    prize_pool_first: 'INR 12,000',
    prize_pool_second: 'INR 8,000',
    prize_pool_third: 'INR 4,000',
    prize_pool_total: 'INR 24,000',
    team_size: 'Individual (1 Member)',
    current_registered: 142,
    max_slots: 150,
    status: 'upcoming',
    rules: JSON.stringify(['Languages allowed: C++, Java, Python 3', 'Automated plagiarism checks', 'Top 8 move to bracket final']),
    rounds: JSON.stringify([
      { roundNumber: 1, name: 'Qualifier DSA Blitz', description: '45 minutes, 20 algorithmic problems on HackerEarth platform.' },
      { roundNumber: 2, name: 'Blind Coding and Bug Hunt', description: 'Type code without visual screen feedback and fix intentionally bugged snippets.' },
      { roundNumber: 3, name: 'Sudden Death 1v1', description: 'Top 8 coders face off in bracket rounds on large projector displays.' }
    ]),
    registration_url: 'https://forms.gle/algoFrenzy2026'
  },
  {
    id: 'ev-csm-neural-arena',
    slug: 'neural-arena-ai-prompt-battle',
    branch_code: 'CSM',
    title: 'Neural Arena: Generative AI and Prompt Engineering Showdown',
    category: 'Hackathon',
    tagline: 'Harness LLMs, Stable Diffusion, and Agent jailbreaks to conquer impossible cognitive challenges',
    description: 'Reverse-prompting challenges and red-teaming adversarial prompt injections against guarded systems.',
    poster_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    junior_coordinators: JSON.stringify([
      { name: 'M. Rahul', role: 'Event Incharge', phone: '+91 99123 44556', email: 'rahul.csm@kitsw.ac.in', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }
    ]),
    venue: 'CSM AI Innovation Hub, Block-IV',
    day: 'Day 2',
    time: '11:00 AM to 03:00 PM',
    prize_pool_first: 'INR 15,000',
    prize_pool_second: 'INR 10,000',
    prize_pool_third: 'INR 5,000',
    prize_pool_total: 'INR 30,000',
    team_size: '1 to 2 Members',
    current_registered: 98,
    max_slots: 100,
    status: 'upcoming',
    rules: JSON.stringify(['API keys provided onsite', 'Reverse prompting scored by cosine similarity metric']),
    rounds: JSON.stringify([
      { roundNumber: 1, name: 'Reverse Prompting and Visual Synthesis', description: 'Reconstruct complex AI visuals using only precise contextual prompts.' },
      { roundNumber: 2, name: 'LLM Jailbreak and Red Teaming', description: 'Bypass defensive system guardrails in a secure sandboxed environment.' }
    ]),
    registration_url: 'https://forms.gle/neuralArena2026'
  },
  {
    id: 'ev-ece-robo-race',
    slug: 'roborush-all-terrain-combat',
    branch_code: 'ECE',
    title: 'RoboRush: National All-Terrain Obstacle Challenge',
    category: 'Robotics',
    tagline: 'High-torque bots navigating mud pits, fire rings, steep ramps, and water hazards',
    description: 'Custom robotic rovers face time trials and head-to-head elimination matches over extreme simulated physical terrain.',
    poster_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    junior_coordinators: JSON.stringify([
      { name: 'K. Praneeth', role: 'Arena Coordinator', phone: '+91 94411 99887', email: 'praneeth.ece@kitsw.ac.in', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80' }
    ]),
    venue: 'Open-Air Amphitheater Tracks',
    day: 'Day 2',
    time: '10:00 AM to 04:00 PM',
    prize_pool_first: 'INR 25,000',
    prize_pool_second: 'INR 15,000',
    prize_pool_third: 'INR 8,000',
    prize_pool_total: 'INR 48,000',
    team_size: '2 to 4 Members',
    current_registered: 44,
    max_slots: 50,
    status: 'upcoming',
    rules: JSON.stringify(['Max dimensions 30cm x 30cm x 30cm', 'Max weight 5kg', 'Max supply voltage 24V DC']),
    rounds: JSON.stringify([
      { roundNumber: 1, name: 'Time Trial Qualifiers', description: 'Single-lap sprint across gravel, speed-breakers, and 30-degree incline.' },
      { roundNumber: 2, name: 'The Gauntlet Final', description: 'Dual-bot elimination race across fire, rotating hurdles, and slippery oils.' }
    ]),
    registration_url: 'https://forms.gle/roboRush2026'
  },
  {
    id: 'ev-civil-bridge-craft',
    slug: 'bridge-craft-load-testing',
    branch_code: 'CIVIL',
    title: 'BridgeCraft: Hydraulic Deflection and Structural Load Testing',
    category: 'Robotics',
    tagline: 'Build ultra-lightweight bridges using balsa wood and test them to catastrophic hydraulic failure',
    description: 'Teams construct truss bridges to exact specifications and submit them to calibrated hydraulic load frames with real-time deflection telemetry.',
    poster_url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80',
    junior_coordinators: JSON.stringify([
      { name: 'K. Vikas', role: 'Structural Incharge', phone: '+91 96180 77665', email: 'vikas.civil@kitsw.ac.in', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }
    ]),
    venue: 'Concrete and Highway Materials Lab - Block I',
    day: 'Day 2',
    time: '01:00 PM to 04:30 PM',
    prize_pool_first: 'INR 15,000',
    prize_pool_second: 'INR 10,000',
    prize_pool_third: 'INR 5,000',
    prize_pool_total: 'INR 30,000',
    team_size: '2 to 3 Members',
    current_registered: 48,
    max_slots: 50,
    status: 'upcoming',
    rules: JSON.stringify(['Only provided balsa strips and synthetic adhesive allowed', 'Max bridge weight 180 grams']),
    rounds: JSON.stringify([
      { roundNumber: 1, name: 'Onsite Construction (2 Hours)', description: 'Fabricate truss bridge with 600mm span and max weight of 180 grams.' },
      { roundNumber: 2, name: 'Crush and Deflection Testing', description: 'Live digital load cell testing measured on projector screen.' }
    ]),
    registration_url: 'https://forms.gle/bridgeCraft2026'
  },
  {
    id: 'ev-csd-sql-sherlock',
    slug: 'sql-sherlock-data-detective',
    branch_code: 'CSD',
    title: 'SQL Sherlock: The Murder Mystery Data Challenge',
    category: 'Coding',
    tagline: 'Solve complex SQL queries across 12 relational tables to unmask the culprit',
    description: 'A heist took place at KITSW. Use CTEs, window functions, and relational joins across forensic logs to prove the perpetrator.',
    poster_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    junior_coordinators: JSON.stringify([
      { name: 'P. Sai Teja', role: 'Query Incharge', phone: '+91 99088 77665', email: 'teja.csd@kitsw.ac.in', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }
    ]),
    venue: 'Block-II Data Science Lab',
    day: 'Day 2',
    time: '02:00 PM to 04:30 PM',
    prize_pool_first: 'INR 10,000',
    prize_pool_second: 'INR 6,000',
    prize_pool_third: 'INR 3,000',
    prize_pool_total: 'INR 19,000',
    team_size: '1 to 2 Members',
    current_registered: 110,
    max_slots: 120,
    status: 'upcoming',
    rules: JSON.stringify(['PostgreSQL sandbox provided', 'Single nested query required for final verdict']),
    rounds: JSON.stringify([
      { roundNumber: 1, name: 'Crime Scene Forensics', description: 'Filter CCTV access logs and match timestamps of suspects.' },
      { roundNumber: 2, name: 'The Final Verdict', description: 'Construct a single nested query that outputs the culprit, motive, and hidden location.' }
    ]),
    registration_url: 'https://forms.gle/sqlSherlock2026'
  }
];

const SCHEDULE_ITEMS = [
  { id: 'sc-1', time: '09:00 AM - 10:30 AM', title: 'Grand Fest Inauguration and Traditional Lamp Lighting', type: 'ceremony', venue: 'Dr. B.R. Ambedkar Central Auditorium', day: 'Day 1', speaker_or_lead: 'Dr. V. Kamakoti (Director, IIT Madras) and KITSW Leadership' },
  { id: 'sc-2', time: '10:45 AM - 12:30 PM', title: 'Keynote Address: The Future of Quantum and Silicon Edge Computing', type: 'keynote', venue: 'Auditorium', day: 'Day 1', speaker_or_lead: 'Dr. Anandhan K. (Microsoft Research)' },
  { id: 'sc-3', time: '01:30 PM - 05:00 PM', title: 'Flagship Workshops Track 1 (CSE, CSM, ECE, MECH)', type: 'workshop', venue: 'Respective Department Specialized Labs', day: 'Day 1', speaker_or_lead: 'Lead Conveners and Industry Resource Persons' },
  { id: 'sc-4', time: '01:30 PM - 04:30 PM', title: 'AlgoFrenzy Extreme Speed Coding Championship', type: 'event', branch_code: 'CSE', venue: 'CSE Lab 1 and 2', day: 'Day 1', speaker_or_lead: 'ACE Technical Team' },
  { id: 'sc-5', time: '09:30 AM - 04:30 PM', title: 'Flagship Workshops Track 2 (CSD, IT, EEE, CIVIL)', type: 'workshop', venue: 'Respective Department Labs', day: 'Day 2', speaker_or_lead: 'Lead Conveners and Industry Experts' },
  { id: 'sc-6', time: '10:00 AM (Day 2) - 10:00 AM (Day 3)', title: 'HackTheFuture 24-Hour National Hackathon', type: 'event', branch_code: 'CSE', venue: 'Central Library Digital Commons', day: 'Day 2', speaker_or_lead: 'Hackathon Organizing Committee' },
  { id: 'sc-7', time: '10:00 AM - 04:00 PM', title: 'RoboRush: National All-Terrain Obstacle Challenge', type: 'event', branch_code: 'ECE', venue: 'Amphitheater Open Arenas', day: 'Day 2', speaker_or_lead: 'AECE Robotics Marshals' },
  { id: 'sc-8', time: '02:30 PM - 04:30 PM', title: 'Grand Valedictory Ceremony and Prize Distribution', type: 'ceremony', venue: 'Dr. B.R. Ambedkar Central Auditorium', day: 'Day 3', speaker_or_lead: 'KITSW Governing Body, Principals, and Alumni Donors' }
];

const LEGACY_EDITIONS = [
  {
    year: 2026,
    theme: 'Synergy of Silicon, Code and Sustainable Structures',
    dates: 'March 12 - 14, 2026',
    total_attendees: 3420,
    total_events: 36,
    total_workshops: 8,
    prize_money_disbursed: 'INR 4,50,000+',
    highlights: JSON.stringify([
      'Inauguration of 50-Year Digital Legacy Vault Platform',
      'Over 200 Hackathon Teams from 74 Indian Engineering Colleges',
      'Autonomous Drone Swarms flight over KITSW Yerragattu Hillock',
      'Silicon ASIC tapeout designs on SkyWater 130nm process'
    ]),
    souvenir_pdf_url: '/archives/samshodhani_souvenir_2026.pdf',
    cover_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
    gallery_preview: JSON.stringify([
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80'
    ]),
    chief_guest_name: 'Dr. V. Kamakoti',
    chief_guest_title: 'Director, Indian Institute of Technology Madras (IIT-M)'
  },
  {
    year: 2025,
    theme: 'Autonomous Frontiers: The Cognitive Leap',
    dates: 'March 14 - 16, 2025',
    total_attendees: 4120,
    total_events: 34,
    total_workshops: 8,
    prize_money_disbursed: 'INR 3,80,000',
    highlights: JSON.stringify([
      'Record-breaking 4,120 delegates across Telangana, AP, Karnataka and Maharashtra',
      'RoboWars arena featured 28 competitive college combat robots',
      'Launch of KITSW AI Sandbox powered by NVIDIA GPUs',
      'Featured in The Hindu and Times of India as premier Telangana tech fest'
    ]),
    souvenir_pdf_url: '/archives/samshodhani_souvenir_2025.pdf',
    cover_image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    gallery_preview: JSON.stringify([
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80'
    ]),
    chief_guest_name: 'Dr. Tessy Thomas',
    chief_guest_title: 'Distinguished Scientist and Missile Woman of India (Ex-Director General, DRDO)'
  },
  {
    year: 2024,
    theme: 'Decarbonize and Synthesize: Sustainable Tech',
    dates: 'March 21 - 23, 2024',
    total_attendees: 3750,
    total_events: 32,
    total_workshops: 8,
    prize_money_disbursed: 'INR 3,25,000',
    highlights: JSON.stringify([
      'First dedicated EV Powertrain live dyno demonstration at KITSW',
      'Over 60 innovative eco-tech prototypes displayed at the green pavilion',
      'Paper presentations published in SCOPUS indexed conference proceedings'
    ]),
    souvenir_pdf_url: '/archives/samshodhani_souvenir_2024.pdf',
    cover_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
    gallery_preview: JSON.stringify([
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80'
    ]),
    chief_guest_name: 'Dr. G. Satheesh Reddy',
    chief_guest_title: 'Former Scientific Advisor to Raksha Mantri and Chairman DRDO'
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Clearing existing records...');
    await client.query('DELETE FROM registrations;');
    await client.query('DELETE FROM schedule_items;');
    await client.query('DELETE FROM legacy_editions;');
    await client.query('DELETE FROM events;');
    await client.query('DELETE FROM workshops;');
    await client.query('DELETE FROM organizers;');
    await client.query('DELETE FROM branches;');

    console.log('Seeding branches...');
    for (const b of BRANCHES) {
      await client.query(
        `INSERT INTO branches (id, code, name, short_name, association_name, association_short, icon_name, faculty_advisor, student_president, contact_email, contact_phone, accent_color, bg_light_color, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [b.id, b.code, b.name, b.short_name, b.association_name, b.association_short, b.icon_name, b.faculty_advisor, b.student_president, b.contact_email, b.contact_phone, b.accent_color, b.bg_light_color, b.description]
      );
    }

    console.log('Seeding organizers...');
    for (const org of ORGANIZERS) {
      await client.query(
        `INSERT INTO organizers (id, branch_code, username, password_hash, name, role)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [org.id, org.branch_code, org.username, org.password_hash, org.name, org.role]
      );
    }

    console.log('Seeding workshops...');
    for (const ws of WORKSHOPS) {
      await client.query(
        `INSERT INTO workshops (id, slug, branch_code, title, tagline, description, poster_url, year_lead_name, year_lead_year, year_lead_phone, year_lead_email, year_lead_avatar, resource_person_name, resource_person_designation, resource_person_company, resource_person_bio, resource_person_avatar, resource_person_linkedin, resource_person_topics, dates, time, venue, fees, max_capacity, current_registered, live_status, prerequisites, takeaways, syllabus, registration_url, google_form_url, report_pdf_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19::jsonb, $20, $21, $22, $23, $24, $25, $26, $27::jsonb, $28::jsonb, $29::jsonb, $30, $31, $32)`,
        [ws.id, ws.slug, ws.branch_code, ws.title, ws.tagline, ws.description, ws.poster_url, ws.year_lead_name, ws.year_lead_year, ws.year_lead_phone, ws.year_lead_email, ws.year_lead_avatar, ws.resource_person_name, ws.resource_person_designation, ws.resource_person_company, ws.resource_person_bio, ws.resource_person_avatar, ws.resource_person_linkedin, ws.resource_person_topics, ws.dates, ws.time, ws.venue, ws.fees, ws.max_capacity, ws.current_registered, ws.live_status, ws.prerequisites, ws.takeaways, ws.syllabus, ws.registration_url, ws.google_form_url, ws.report_pdf_url]
      );
    }

    console.log('Seeding events...');
    for (const ev of EVENTS) {
      await client.query(
        `INSERT INTO events (id, slug, branch_code, title, category, tagline, description, poster_url, junior_coordinators, venue, day, time, prize_pool_first, prize_pool_second, prize_pool_third, prize_pool_total, team_size, current_registered, max_slots, status, rules, rounds, registration_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21::jsonb, $22::jsonb, $23)`,
        [ev.id, ev.slug, ev.branch_code, ev.title, ev.category, ev.tagline, ev.description, ev.poster_url, ev.junior_coordinators, ev.venue, ev.day, ev.time, ev.prize_pool_first, ev.prize_pool_second, ev.prize_pool_third, ev.prize_pool_total, ev.team_size, ev.current_registered, ev.max_slots, ev.status, ev.rules, ev.rounds, ev.registration_url]
      );
    }

    console.log('Seeding schedule...');
    for (const sc of SCHEDULE_ITEMS) {
      await client.query(
        `INSERT INTO schedule_items (id, time, title, type, branch_code, venue, day, speaker_or_lead)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [sc.id, sc.time, sc.title, sc.type, sc.branch_code || null, sc.venue, sc.day, sc.speaker_or_lead || null]
      );
    }

    console.log('Seeding legacy editions...');
    for (const leg of LEGACY_EDITIONS) {
      await client.query(
        `INSERT INTO legacy_editions (year, theme, dates, total_attendees, total_events, total_workshops, prize_money_disbursed, highlights, souvenir_pdf_url, cover_image, gallery_preview, chief_guest_name, chief_guest_title)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11::jsonb, $12, $13)`,
        [leg.year, leg.theme, leg.dates, leg.total_attendees, leg.total_events, leg.total_workshops, leg.prize_money_disbursed, leg.highlights, leg.souvenir_pdf_url, leg.cover_image, leg.gallery_preview, leg.chief_guest_name, leg.chief_guest_title]
      );
    }

    console.log('Database seeded with 100% realistic institutional data!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
