export const toSectionId = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildSection = (title, summary, detail, highlights) => ({
  id: toSectionId(title),
  title,
  summary,
  detail,
  highlights,
});

export const learnMoreSectionsByContext = {
  user: [
    buildSection(
      "Carbon Footprint Calculator",
      "Measure your personal or organisational carbon footprint with our AI-powered calculator and get clear emission breakdowns.",
      "The calculator supports activity-based inputs and turns them into practical actions, so users can move from awareness to measurable reduction plans.",
      [
        "Category-wise emission analysis",
        "Personalised reduction recommendations",
        "Progress tracking over time",
      ],
    ),
    buildSection(
      "Sustainability Analytics",
      "Track your green journey with live dashboards and benchmark your impact against meaningful targets.",
      "Analytics views are designed for quick interpretation, helping individuals and teams identify trends, gaps, and strong-performing actions.",
      [
        "Visual KPI dashboards",
        "Trend and baseline comparison",
        "Monthly and quarterly performance insights",
      ],
    ),
    buildSection(
      "Tree Planting Campaigns",
      "Join community-led tree planting campaigns where actions on the platform can be linked to real-world impact.",
      "Campaign participation is built to keep engagement practical: contribute, track progress, and view campaign milestones from one place.",
      [
        "Community campaign participation",
        "Track contribution milestones",
        "Visibility into campaign progress",
      ],
    ),
    buildSection(
      "Carbon Offset Marketplace",
      "Browse verified offset projects and support initiatives aligned with your sustainability goals.",
      "Project details are presented in a structured way so users can compare quality indicators and choose offsets with confidence.",
      [
        "Verified project listings",
        "Clear project comparison information",
        "Impact-focused offset selection",
      ],
    ),
    buildSection(
      "Community Challenges",
      "Participate in collaborative challenges to reduce emissions through consistent action and friendly competition.",
      "Challenge formats are designed for motivation and accountability, making it easier to build habits and sustain momentum.",
      [
        "Individual and group challenges",
        "Shared progress tracking",
        "Recognition for consistent participation",
      ],
    ),
    buildSection(
      "Green Learning Hub",
      "Access curated learning content to build practical sustainability knowledge while staying engaged on the platform.",
      "Resources combine foundational concepts with implementation-focused guidance so users can apply what they learn immediately.",
      [
        "Curated learning modules",
        "Practical implementation guides",
        "Continuous knowledge updates",
      ],
    ),
  ],
  organisation: [
    buildSection(
      "Carbon Marketplace and Portfolio",
      "A structured platform for sourcing, evaluating, and managing verified carbon credits across multiple project types, registries, and geographies - designed to support long-term decarbonisation strategies and portfolio transparency.",
      "The Carbon Marketplace and Portfolio module enables organisations to source high-integrity carbon credits while maintaining visibility over portfolio performance and risk exposure. Credits can be evaluated by project type (renewable, nature-based, industrial), registry alignment, geographic distribution, vintage year, and verification status. Beyond procurement, the system supports portfolio construction with tracking for allocation, retirement status, price trends, and impact metrics over time. This helps organisations treat carbon credits as strategic climate assets aligned with emission reduction pathways and long-term net-zero commitments. Consolidated dashboards support sustainability and finance teams in balancing cost, impact integrity, and diversification, while documentation layers strengthen audit readiness and ESG disclosure alignment.",
      [
        "Verified carbon credit sourcing across multiple registries",
        "Project-level transparency and documentation access",
        "Credit vintage and quality tier comparison",
        "Portfolio diversification tracking (sector and geography)",
        "Credit retirement and usage monitoring",
        "Risk exposure and dependency analysis",
        "Integrated ESG reporting compatibility",
        "Long-term carbon asset performance tracking",
        "Price trend and procurement planning visibility",
        "Impact categorisation (renewable, nature-based, industrial)",
      ],
    ),
    buildSection(
      "Carbon Project Feasibility",
      "A structured evaluation framework to assess technical viability, regulatory eligibility, and projected carbon credit yield before project initiation.",
      "The Carbon Project Feasibility module enables organisations to assess whether a proposed sustainability initiative can generate verified carbon credits under recognised methodologies. It evaluates baseline emissions, additionality conditions, monitoring requirements, and projected credit volumes based on activity data and reduction pathways. Financial sensitivity modelling helps decision-makers understand capital expenditure, operational costs, credit issuance timelines, and expected returns under different pricing scenarios. By identifying risks early - technical, regulatory, or market-based - the feasibility framework reduces uncertainty before validation and registry submission. This ensures that only viable, methodology-aligned projects move forward to the implementation and verification stages.",
      [
        "Baseline emission scenario modelling",
        "Additionality and eligibility screening",
        "Projected carbon credit yield estimation",
        "Sensitivity and return modelling",
        "Methodology compatibility analysis",
        "Risk identification (technical and regulatory)",
        "Capital planning inputs",
        "Pre-validation documentation readiness",
      ],
    ),
    buildSection(
      "Sustainability Asset Management",
      "Lifecycle-based monitoring and governance of renewable, efficiency, and climate-linked assets.",
      "The Sustainability Asset Management module centralises performance tracking for renewable installations, energy efficiency systems, industrial upgrades, and nature-based projects. It connects operational data with emission reduction outputs, allowing organisations to measure environmental and financial performance in parallel. Asset dashboards provide KPI visibility across generation output, emission intensity, maintenance cycles, and compliance status. Structured documentation ensures traceability, simplifying internal governance and third-party verification. By linking operational performance to carbon outcomes, the system strengthens accountability and long-term sustainability value creation.",
      [
        "Lifecycle and KPI tracking",
        "Asset-level emission reduction mapping",
        "Operational and environmental data integration",
        "Maintenance and compliance logs",
        "Multi-site asset visibility",
        "Performance deviation alerts",
        "Audit-ready documentation records",
        "Emission intensity monitoring",
      ],
    ),
    buildSection(
      "ESG and Compliance",
      "Structured workflows for aligning sustainability operations with recognised ESG disclosure frameworks and regulatory standards.",
      "The ESG and Compliance module streamlines sustainability reporting through evidence-backed documentation and governance controls. It aligns operational data with recognised reporting standards, enabling organisations to generate structured disclosures and internal performance reports. Built-in audit trails track data modifications and reporting history, improving transparency and review readiness. Framework alignment ensures compatibility with evolving regulatory landscapes and investor expectations. Rather than reactive compliance, this module supports proactive governance, helping organisations maintain credibility across internal stakeholders, regulators, and capital markets.",
      [
        "Framework-aligned reporting workflows",
        "Structured ESG data consolidation",
        "Audit trail and change history logs",
        "Evidence-backed compliance tracking",
        "Disclosure-ready reporting templates",
        "Internal governance dashboards",
        "Regulatory alignment monitoring",
        "Data validation checkpoints",
      ],
    ),
    buildSection(
      "MRV",
      "Standardised data pipelines that ensure accurate, traceable, and verification-ready emissions accounting.",
      "The MRV module establishes structured systems for measuring emissions, generating standardised reports, and preparing documentation for independent verification. Data inputs are normalised using consistent emission factors and activity aggregation methods. Traceability layers ensure that emission calculations can be audited and validated. Cross-site consolidation enables unified emissions accounting across facilities and business units. By strengthening data integrity and verification readiness, MRV systems reduce reporting inconsistencies and improve credibility in carbon markets and ESG disclosures.",
      [
        "Standardised emissions data capture",
        "Scope 1, 2, and 3 integration",
        "Emission factor alignment controls",
        "Automated activity aggregation",
        "Verification-focused reporting outputs",
        "Cross-site emissions consolidation",
        "Data traceability and audit support",
        "Reduced reporting inconsistencies",
      ],
    ),
    buildSection(
      "Methodology and Registry Advisory",
      "Strategic guidance on selecting appropriate carbon methodologies and registry pathways for validation and issuance.",
      "The Methodology and Registry Advisory module supports organisations in identifying suitable carbon accounting methodologies based on project type, geographic eligibility, and regulatory constraints. It assists in defining project boundaries, ensuring alignment with registry requirements, and structuring documentation for validation and verification processes. Registry comparison tools help teams evaluate credibility, market recognition, issuance timelines, and long-term governance implications. By aligning methodology selection with strategic climate goals, organisations reduce registration friction and strengthen long-term carbon asset value.",
      [
        "Methodology suitability assessment",
        "Registry pathway comparison",
        "Project boundary definition support",
        "Validation and issuance planning",
        "Documentation structuring guidance",
        "Regulatory compatibility checks",
        "Governance alignment review",
        "Long-term carbon strategy alignment",
      ],
    ),
  ],
};
