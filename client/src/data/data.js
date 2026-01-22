export const initialData = {
  activities: [
    {
      id: 1,
      type: "content",
      note: "Followed John Smith - interesting posts about SMB tech",
      link: "https://linkedin.com/in/johnsmith",
      personId: 1,
      companyId: null,
      documentIds: [],
      status: "open",
      created: "2025-01-22T10:30:00",
      touches: []
    },
    {
      id: 2,
      type: "outreach",
      note: "Cold email to Sarah about dev role",
      link: "",
      personId: 2,
      companyId: 1,
      documentIds: [1, 2],
      status: "active",
      created: "2025-01-20T14:00:00",
      touches: [
        { date: "2025-01-21T09:15:00", note: "She responded! Wants to set up a call next week." }
      ]
    },
    {
      id: 3,
      type: "application",
      note: "Applied to Junior Dev position",
      link: "https://acmecorp.com/careers/junior-dev",
      personId: null,
      companyId: 1,
      documentIds: [1],
      status: "open",
      created: "2025-01-19T11:00:00",
      touches: []
    },
    {
      id: 4,
      type: "networking",
      note: "Joined SMB Tech Slack community",
      link: "https://smbtechslack.com",
      personId: null,
      companyId: null,
      documentIds: [],
      status: "open",
      created: "2025-01-18T16:45:00",
      touches: []
    }
  ],

  people: [
    { id: 1, name: "John Smith", role: "CTO", companyId: null, link: "https://linkedin.com/in/johnsmith", notes: "Posts good content about building for SMBs" },
    { id: 2, name: "Sarah Chen", role: "Engineering Manager", companyId: 1, link: "https://linkedin.com/in/sarahchen", notes: "Met at tech meetup" }
  ],

  companies: [
    { id: 1, name: "Acme Corp", tier: "dream", link: "https://acmecorp.com", notes: "Great culture, remote-friendly, serves local businesses" },
    { id: 2, name: "BigTech Inc", tier: "meh", link: "https://bigtech.com", notes: "Good pay but corporate" },
    { id: 3, name: "CryptoStartup", tier: "blacklist", link: "", notes: "Against my values" }
  ],

  documents: [
    { id: 1, name: "Resume v3", link: "https://docs.google.com/document/d/xxx", type: "resume" },
    { id: 2, name: "Cover Letter - SMB Focus", link: "https://docs.google.com/document/d/yyy", type: "cover" },
    { id: 3, name: "Portfolio", link: "https://plaintalktech.com", type: "portfolio" }
  ],

  values: [
    { id: 1, text: "Remote or hybrid only", type: "good" },
    { id: 2, text: "Serves real businesses (not just tech)", type: "good" },
    { id: 3, text: "Clear communication culture", type: "good" },
    { id: 4, text: "Equity or ownership potential", type: "good" },
    { id: 5, text: "No crypto/gambling/predatory", type: "bad" },
    { id: 6, text: "No open floor plans", type: "bad" },
    { id: 7, text: "No 'move fast break things' chaos", type: "bad" }
  ],

  resources: [
    { id: 1, name: "SMB Association", link: "https://smbassoc.org", lastEngaged: "2025-01-20", notes: "Weekly newsletter, job board" },
    { id: 2, name: "Job Search Matrix", link: "https://docs.google.com/spreadsheets/xxx", lastEngaged: "2025-01-22", notes: "Master tracking sheet" },
    { id: 3, name: "Career Counselor - Mike", link: "", lastEngaged: "2025-01-15", notes: "Bi-weekly calls, good for strategy" }
  ]
};