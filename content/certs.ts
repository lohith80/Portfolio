export type Cert = {
  id: string;
  name: string;
  issuer: string;
  status: 'active' | 'pursuing';
  issued?: string;
  verifyUrl?: string;
  credentialId?: string;
  color: 'phos' | 'magenta' | 'amber';
  abbr: string;
};

export const certs: Cert[] = [
  {
    id: 'aws-saa',
    abbr: 'AWS SAA-C03',
    name: 'AWS Certified Solutions Architect — Associate',
    issuer: 'Amazon Web Services',
    status: 'active',
    color: 'amber',
    verifyUrl: 'https://www.credly.com/users/indulohithnarisetty',
  },
  {
    id: 'sec-plus',
    abbr: 'Security+ ce',
    name: 'CompTIA Security+ (ce)',
    issuer: 'CompTIA',
    status: 'active',
    color: 'phos',
    verifyUrl: 'https://www.credly.com/users/indulohithnarisetty',
  },
  {
    id: 'cysa',
    abbr: 'CySA+',
    name: 'CompTIA Cybersecurity Analyst+',
    issuer: 'CompTIA',
    status: 'active',
    color: 'phos',
    verifyUrl: 'https://www.credly.com/users/indulohithnarisetty',
  },
  {
    id: 'az500',
    abbr: 'AZ-500',
    name: 'Microsoft Certified: Azure Security Engineer Associate',
    issuer: 'Microsoft',
    status: 'active',
    color: 'phos',
    verifyUrl: 'https://learn.microsoft.com/en-us/users/indulohithnarisetty/credentials',
  },
  {
    id: 'cissp',
    abbr: 'CISSP',
    name: 'Certified Information Systems Security Professional',
    issuer: '(ISC)²',
    status: 'pursuing',
    color: 'magenta',
  },
];
