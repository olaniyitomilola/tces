function extractRequirements(role) {
    const jobTypes = Object.entries(role)
      .filter(([key, val]) => key.startsWith('jobtype_') && val === true)
      .map(([key]) => key.replace(/^jobtype_/, ''));  // e.g. "civils", "surveying"
    
    const tickets = Object.entries(role)
      .filter(([key, val]) => key.startsWith('ticket_') && val === true)
      .map(([key]) => key.replace(/^ticket_/, ''));   // e.g. "coss", "es"
  
    return { jobTypes, tickets };
  }
  
export default extractRequirements;  