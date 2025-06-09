const staff = [
  {
    id: 1,
    firstName: 'Altin',
    lastName: 'Staka',
    role: 'Managing Director',
    email: 'altin@trackcivileng.uk',
    phone: '07000000001',
    nin: 'QQ123456C',
    address: '49 Featherstone Street, London, EC1Y 8SY',
    isDriver: false,
    licenseNumber: '',
    hasPTS: false,
    ptsNumber: '',
    tickets: { COSS: false, ES: false, MC: false },
    employmentType: 'full-time',
    availability: {
      Monday: true,
      Tuesday: true,
      Wednesday: true,
      Thursday: true,
      Friday: true,
      Saturday: false,
      Sunday: false
    },
    jobTypes: {
      Civils: false,
      Surveying: false,
      HBE: false,
      Management: true
    }
  },
  {
    id: 2,
    firstName: 'George',
    lastName: 'Milliken',
    role: 'Operations Manager',
    email: 'george@trackcivileng.uk',
    phone: '07000000002',
    nin: 'QQ123456D',
    address: '1 Chapel Hill, Bournemouth, BH1 1AA',
    isDriver: true,
    licenseNumber: 'D1234567',
    hasPTS: true,
    ptsNumber: 'PTS123456',
    tickets: { COSS: true, ES: false, MC: true },
    employmentType: 'full-time',
    availability: {
      Monday: true,
      Tuesday: true,
      Wednesday: true,
      Thursday: true,
      Friday: true,
      Saturday: false,
      Sunday: false
    },
    jobTypes: {
      Civils: true,
      Surveying: true,
      HBE: false,
      Management: false
    }
  },
  {
    id: 3,
    firstName: 'Tomilola',
    lastName: 'Olaniyi',
    role: 'Land Surveyor',
    email: 'tomilola@trackcivileng.uk',
    phone: '07000000003',
    nin: 'QQ123456E',
    address: '3 High Street, Southampton, SO31 4NG',
    isDriver: false,
    licenseNumber: '',
    hasPTS: false,
    ptsNumber: '',
    tickets: { COSS: false, ES: true, MC: false },
    employmentType: 'part-time',
    availability: {
      Monday: true,
      Tuesday: false,
      Wednesday: true,
      Thursday: false,
      Friday: true,
      Saturday: false,
      Sunday: false
    },
    jobTypes: {
      Civils: false,
      Surveying: true,
      HBE: false,
      Management: false
    }
  }
];

export default staff;
