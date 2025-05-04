export type Category = 'technical' | 'experience' | 'education' | 'projects' | 'soft-skills' | 'overall';

export interface RatingCriteria {
  weight: number;
  maxScore: number;
  description: string;
}

export interface CategoryCriteria {
  [key: string]: RatingCriteria;
}

export interface ResumeRating {
  id: string;
  userId: string;
  timestamp: Date;
  categories: {
    [K in Category]: {
      score: number;
      breakdown: {
        [key: string]: number;
      };
    };
  };
  overallScore: number;
  resumeText: string;
}

export interface LeaderboardEntry {
  userId: string;
  scores: {
    [K in Category]: number;
  };
  overallScore: number;
  lastUpdated: Date;
  rank: number;
}

// Industry standard criteria with high standards
export const RATING_CRITERIA: Record<Category, CategoryCriteria> = {
  technical: {
    'core-technologies': { weight: 0.3, maxScore: 30, description: 'Proficiency in core technologies' },
    'advanced-concepts': { weight: 0.25, maxScore: 25, description: 'Understanding of advanced concepts' },
    'problem-solving': { weight: 0.25, maxScore: 25, description: 'Problem-solving abilities' },
    'technical-achievements': { weight: 0.2, maxScore: 20, description: 'Notable technical achievements' }
  },
  experience: {
    'years-experience': { weight: 0.2, maxScore: 20, description: 'Relevant years of experience' },
    'company-reputation': { weight: 0.25, maxScore: 25, description: 'Company reputation and impact' },
    'role-complexity': { weight: 0.3, maxScore: 30, description: 'Role complexity and responsibilities' },
    'achievements': { weight: 0.25, maxScore: 25, description: 'Measurable achievements' }
  },
  education: {
    'degree-level': { weight: 0.3, maxScore: 30, description: 'Highest degree level' },
    'institution-reputation': { weight: 0.25, maxScore: 25, description: 'Institution reputation' },
    'relevant-courses': { weight: 0.25, maxScore: 25, description: 'Relevant coursework' },
    'academic-achievements': { weight: 0.2, maxScore: 20, description: 'Academic achievements' }
  },
  projects: {
    'project-complexity': { weight: 0.3, maxScore: 30, description: 'Project complexity' },
    'technical-stack': { weight: 0.25, maxScore: 25, description: 'Technical stack used' },
    'impact': { weight: 0.25, maxScore: 25, description: 'Project impact' },
    'innovation': { weight: 0.2, maxScore: 20, description: 'Innovation level' }
  },
  'soft-skills': {
    'communication': { weight: 0.3, maxScore: 30, description: 'Communication skills' },
    'leadership': { weight: 0.25, maxScore: 25, description: 'Leadership abilities' },
    'teamwork': { weight: 0.25, maxScore: 25, description: 'Team collaboration' },
    'adaptability': { weight: 0.2, maxScore: 20, description: 'Adaptability' }
  },
  overall: {
    'consistency': { weight: 0.3, maxScore: 30, description: 'Consistency across categories' },
    'uniqueness': { weight: 0.25, maxScore: 25, description: 'Unique achievements' },
    'growth': { weight: 0.25, maxScore: 25, description: 'Career growth trajectory' },
    'industry-impact': { weight: 0.2, maxScore: 20, description: 'Industry impact' }
  }
}; 