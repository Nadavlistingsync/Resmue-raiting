import { Category, ResumeRating, LeaderboardEntry, RATING_CRITERIA, TIERS } from './types';

export class RatingService {
  private static instance: RatingService;
  private ratings: Map<string, ResumeRating[]> = new Map();
  private leaderboards: Map<Category, LeaderboardEntry[]> = new Map();

  private constructor() {}

  public static getInstance(): RatingService {
    if (!RatingService.instance) {
      RatingService.instance = new RatingService();
    }
    return RatingService.instance;
  }

  public rateResume(resumeText: string, userId: string): ResumeRating {
    const rating = this.calculateRating(resumeText, userId);
    this.storeRating(rating);
    this.updateLeaderboards(rating);
    return rating;
  }

  private calculateRating(resumeText: string, userId: string): ResumeRating {
    const rating: ResumeRating = {
      id: crypto.randomUUID(),
      userId,
      timestamp: new Date(),
      categories: {} as any,
      overallScore: 0,
      resumeText
    };

    // Calculate scores for each category
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const category of Object.keys(RATING_CRITERIA) as Category[]) {
      const categoryScore = this.calculateCategoryScore(resumeText, category);
      rating.categories[category] = categoryScore;
      
      // Weight the category score based on its importance
      const categoryWeight = this.getCategoryWeight(category);
      totalWeightedScore += categoryScore.score * categoryWeight;
      totalWeight += categoryWeight;
    }

    // Calculate overall score (normalized to 100)
    rating.overallScore = Math.min(100, Math.round((totalWeightedScore / totalWeight) * 100));

    // Calculate displayScore as sum of main four categories (max 100)
    const displayScore =
      (rating.categories.technical?.score || 0) +
      (rating.categories.experience?.score || 0) +
      (rating.categories.education?.score || 0) +
      (rating.categories.projects?.score || 0);

    // Determine tier based on displayScore
    rating.tier = TIERS.find(tier =>
      displayScore >= tier.minScore && displayScore <= tier.maxScore
    );

    // Attach displayScore for API consumers
    (rating as any).displayScore = displayScore;

    return rating;
  }

  private calculateCategoryScore(resumeText: string, category: Category) {
    const criteria = RATING_CRITERIA[category];
    const breakdown: Record<string, number> = {};
    let totalScore = 0;

    for (const [criterion, details] of Object.entries(criteria)) {
      // AI-based scoring for each criterion
      const score = this.scoreCriterion(resumeText, criterion, category);
      breakdown[criterion] = score;
      totalScore += score * details.weight;
    }

    return {
      score: Math.min(100, Math.round(totalScore)),
      breakdown
    };
  }

  private scoreCriterion(resumeText: string, criterion: string, category: Category): number {
    // This is where we'll integrate with AI/ML models for actual scoring
    // For now, using a placeholder implementation
    const criteria = RATING_CRITERIA[category][criterion];
    const maxScore = criteria.maxScore;
    
    // Placeholder: Random score between 0 and maxScore
    // In production, this would use AI/ML models to analyze the resume
    return Math.floor(Math.random() * maxScore);
  }

  private getCategoryWeight(category: Category): number {
    // Weights for each category in overall score calculation
    const weights: Record<Category, number> = {
      technical: 0.25,
      experience: 0.25,
      education: 0.15,
      projects: 0.15,
      'soft-skills': 0.1,
      overall: 0.1
    };
    return weights[category];
  }

  private storeRating(rating: ResumeRating) {
    if (!this.ratings.has(rating.userId)) {
      this.ratings.set(rating.userId, []);
    }
    this.ratings.get(rating.userId)!.push(rating);
  }

  private updateLeaderboards(rating: ResumeRating) {
    // Update each category leaderboard
    for (const category of Object.keys(rating.categories) as Category[]) {
      const entry: LeaderboardEntry = {
        userId: rating.userId,
        scores: {
          technical: rating.categories.technical.score,
          experience: rating.categories.experience.score,
          education: rating.categories.education.score,
          projects: rating.categories.projects.score,
          'soft-skills': rating.categories['soft-skills'].score,
          overall: rating.overallScore
        },
        overallScore: rating.overallScore,
        lastUpdated: rating.timestamp,
        rank: 0
      };

      if (!this.leaderboards.has(category)) {
        this.leaderboards.set(category, []);
      }

      const leaderboard = this.leaderboards.get(category)!;
      const existingIndex = leaderboard.findIndex(e => e.userId === rating.userId);

      if (existingIndex >= 0) {
        leaderboard[existingIndex] = entry;
      } else {
        leaderboard.push(entry);
      }

      // Sort and update ranks
      leaderboard.sort((a, b) => b.scores[category] - a.scores[category]);
      leaderboard.forEach((entry, index) => {
        entry.rank = index + 1;
      });
    }
  }

  public getLeaderboard(category: Category): LeaderboardEntry[] {
    return this.leaderboards.get(category) || [];
  }

  public getUserHistory(userId: string): ResumeRating[] {
    return this.ratings.get(userId) || [];
  }

  public getAverageScore(userId: string, category: Category): number {
    const userRatings = this.ratings.get(userId) || [];
    if (userRatings.length === 0) return 0;

    const totalScore = userRatings.reduce((sum, rating) => 
      sum + rating.categories[category].score, 0);
    return Math.round(totalScore / userRatings.length);
  }
} 