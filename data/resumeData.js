/**
 * RESUME DATA — single source of truth.
 * Every field here is transcribed directly from Gayatri Devi P's resume PDF.
 * Nothing in this file is invented — components/render.js only presents it.
 */
window.RESUME = {
  person: {
    name: "Gayatri Devi P",
    title: "Senior .NET Full Stack Developer",
    subtitle: "ASP.NET Core · Angular · AWS · Microservices",
    location: "Singapore",
    phone: "+65 8895 7511",
    phoneHref: "+6588957511",
    email: "gayatridevi.palla@gmail.com",
    linkedinLabel: "linkedin.com/in/gayatri-devi-p",
    linkedinHref: "https://www.linkedin.com/in/gayatri-devi-p",
  },

  summary: [
    "Senior .NET Full Stack Developer with over 7+ years of experience designing, developing, and delivering enterprise-scale applications across Payments, Financial Services, Insurance, Identity & Access Management (IAM), and Singapore Government sectors.",
    "Expertise in C#, ASP.NET Core, Angular, Microservices, SQL Server, and AWS Cloud with a strong track record of building secure, scalable, cloud-native applications. Experienced in payment gateway integrations, authentication platforms, distributed systems, API development, cloud modernization, and end-to-end software delivery in Agile environments.",
    "Proficient in designing high-availability solutions, implementing event-driven architectures, and collaborating with cross-functional teams to deliver mission-critical business applications.",
  ],

  domains: [
    "Payments",
    "Financial Services",
    "Government Systems",
    "Identity & Access Management",
    "Insurance",
  ],

  // Directly supported by the resume: explicit "7+ years", a literal 30% metric,
  // and simple counts of the entries listed below (3 employers, 4 client engagements, 3 certifications).
  stats: [
    { value: "7+", label: "Years of Experience" },
    { value: "3", label: "Organizations" },
    { value: "4", label: "Enterprise Engagements" },
    { value: "30%", label: "Payment Latency Reduced" },
    { value: "3", label: "Professional Certifications" },
  ],

  skills: {
    intro: "Core competencies, grouped exactly as presented on the resume. Technologies repeated across every engagement — C#, ASP.NET Core, Angular, AWS, Microservices — form the core stack.",
    core: ["C#", "ASP.NET Core", "Angular", "AWS", "Microservices"],
    groups: [
      {
        title: "Technologies",
        items: ["C#", "ASP.NET Core", ".NET Core", "Entity Framework", "Angular", "TypeScript", "JavaScript", "REST APIs", "Microservices", "RabbitMQ", "WCF", "SOAP Services", "HTML5", "CSS3"],
      },
      {
        title: "Cloud & DevOps",
        items: ["AWS Lambda", "EC2", "AWS ECS/EKS", "RDS", "API Gateway", "Docker", "Kubernetes", "SNS/SQS", "CloudWatch", "CI/CD", "IAM", "AWS Secrets Manager", "AWS ECR", "CodeCommit"],
      },
      {
        title: "Databases & Testing Tools",
        items: ["SQL Server", "MySQL", "Git", "Swagger", "Postman", "NSwag Studio", "Visual Studio", "VS Code", "xUnit", "Moq"],
      },
      {
        title: "Domain Knowledge",
        items: ["Payments", "Financial Services", "Government Systems", "Identity & Access Management", "Insurance"],
      },
    ],
  },

  // Organizational / role history — chronology & scope of employment.
  experience: [
    {
      org: "Cognizant Technology Solutions (CTS)",
      location: "Singapore",
      role: "Senior .NET Full Stack Developer",
      dates: "2022 — Present",
      current: true,
      engagementRefs: ["cps", "charity"],
    },
    {
      org: "Speridian Technologies",
      location: "India",
      role: "Systems Analyst / .NET Full Stack Developer",
      dates: "Dec 2021 — 2022",
      engagementRefs: ["ciam"],
    },
    {
      org: "Larsen & Toubro Infotech (LTI)",
      location: "India",
      role: "Software Engineer",
      dates: "Aug 2019 — Nov 2021",
      engagementRefs: ["underwriting"],
    },
  ],

  // Client engagements / projects — presented as case studies.
  projects: [
    {
      id: "cps",
      name: "Common Payment System",
      shortName: "CPS",
      client: "Singapore Land Authority (SLA)",
      org: "Cognizant Technology Solutions",
      dates: "2025 — Present",
      description: "Centralized payment platform supporting digital payment transactions across Singapore government services through PayNow, GIRO, Credit Card, DBS, and eNETS payment channels.",
      keySkills: ["ASP.NET Core", "C#", "Angular", "Microservices", "AWS", "Docker", "Kubernetes", "SQL Server", "Git", "CI/CD"],
      contributions: [
        "Developed scalable microservices and REST APIs for payment processing, transaction lifecycle management, and reconciliation workflows.",
        "Integrated DBS and eNETS, and Workday Cumulus payment gateways to support multiple secure payment channels.",
        "Built event-driven processing components using AWS SNS and SQS to improve reliability and system resilience, supporting thousands of users daily.",
        "Developed and deployed containerized services using Docker, Kubernetes, Amazon EKS, and ECS.",
        "Leveraged AWS services including Lambda, API Gateway, S3, RDS, Secrets Manager, and CloudWatch to build cloud-native applications.",
        "Reduced payment transaction processing latency by 30% through microservice optimization.",
        "Participated in solution design, code reviews, testing, deployment automation, and production support activities.",
        "Collaborated with business stakeholders, architects, vendors, and cross-functional teams to deliver highly available payment services.",
      ],
      metric: { value: "30%", label: "reduction in payment transaction processing latency" },
      // Architecture as literally described in the bullets above — channels feeding
      // microservices, an event bus, and a cloud deployment layer.
      architecture: {
        caption: "Payment processing flow, as described in the CPS engagement",
        channels: ["PayNow", "GIRO", "Credit Card", "DBS", "eNETS"],
        core: { label: "CPS Microservices", sub: "ASP.NET Core REST APIs · transaction lifecycle & reconciliation" },
        eventBus: { label: "Event-Driven Layer", sub: "AWS SNS / SQS" },
        data: { label: "SQL Server", sub: "Transaction data" },
        deploy: { label: "Cloud Deployment", sub: "Docker · Kubernetes · Amazon EKS / ECS" },
      },
    },
    {
      id: "charity",
      name: "Charity Portal e-Services",
      shortName: "Charity Portal",
      client: "Ministry of Culture, Community and Youth (MCCY)",
      org: "Cognizant Technology Solutions",
      dates: "2022 — 2024",
      description: "Government digital platform enabling organizations to register and manage charitable entities through Singpass and Corppass authentication.",
      keySkills: ["ASP.NET Core", "Angular", "SQL Server", "AWS", "REST APIs", "Git", "CI/CD"],
      contributions: [
        "Developed end-to-end full-stack features using Angular and ASP.NET Core.",
        "Designed and implemented RESTful APIs supporting charity registration, application processing, and regulatory workflows.",
        "Integrated Singpass and Corppass authentication through CAMS integration for secure user onboarding and access control.",
        "Developed scalable backend services implementing complex business validation and workflow processing logic.",
        "Built reusable Angular components to improve maintainability and user experience.",
        "Optimized SQL Server queries, stored procedures, and database objects to enhance application performance significantly.",
        "Contributed to microservices architecture, API governance, and cloud migration to GCC.",
        "Utilized AWS services including Lambda, API Gateway, ECS, IAM, CloudWatch, and S3 for deployment and monitoring.",
        "Participated in Agile ceremonies, technical design discussions, testing, and production deployments.",
      ],
    },
    {
      id: "ciam",
      name: "Customer Identity & Access Management (CIAM)",
      shortName: "CIAM",
      client: "H&R Block, USA",
      org: "Speridian Technologies",
      dates: "Dec 2021 — 2022",
      description: "Enterprise authentication and authorization platform supporting online tax filing applications and financial products.",
      keySkills: ["ASP.NET Core", "Angular 8", "SQL Server", "Microservices", "PingOne", "PingDirectory", "xUnit", "Moq"],
      contributions: [
        "Developed and maintained secure authentication and authorization solutions using ASP.NET Core and Angular.",
        "Designed RESTful APIs supporting user authentication, authorization, and identity management workflows.",
        "Integrated PingOne and PingDirectory solutions to enable secure customer identity services.",
        "Developed microservices supporting customer registration, account management, and access control.",
        "Implemented unit and integration testing using xUnit and Moq to improve code quality and maintainability.",
        "Collaborated with product owners and business teams to analyze requirements and deliver enhancements.",
        "Participated in code reviews, sprint planning, retrospectives, and release activities.",
      ],
    },
    {
      id: "underwriting",
      name: "Insurance Underwriting vNext",
      shortName: "Underwriting vNext",
      client: "TAPCO Insurance, USA",
      org: "Larsen & Toubro Infotech (LTI)",
      dates: "Aug 2019 — Nov 2021",
      description: "Enterprise underwriting platform supporting Personal Liability, Commercial Property, Homeowners, and Dwelling insurance products.",
      keySkills: ["C#", ".NET Core 3.1", "Angular 8", "WPF", "Entity Framework", "SQL Server", "RabbitMQ", "WCF"],
      contributions: [
        "Developed and maintained full-stack business applications using C#, .NET Core, Angular, and WPF.",
        "Designed and implemented underwriting modules supporting multiple insurance product lines.",
        "Enhanced legacy systems through modernization initiatives, UI improvements, and performance optimization.",
        "Built REST and SOAP services to support integrations with external business systems.",
        "Developed backend services using Entity Framework, SQL Server, and Windows Services.",
        "Implemented asynchronous messaging solutions using RabbitMQ.",
        "Conducted unit testing and integration testing to ensure application quality and stability.",
        "Mentored junior developers and contributed to technical discussions and solution design initiatives.",
        "Collaborated closely with business analysts, QA teams, and client stakeholders within Agile teams.",
      ],
    },
  ],

  certifications: [
    { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services" },
    { name: "AWS Developer Associate", issuer: "Amazon Web Services" },
    { name: "AgilePoint NX Certification Exam", issuer: "AgilePoint Application Developer" },
  ],

  education: [
    {
      degree: "Bachelor of Technology (B.Tech)",
      year: "2019",
      institution: "B.S. Abdur Rahman Crescent Institute of Science and Technology",
      location: "Chennai, India",
    },
  ],
};
