// Utility functions for SEO Analysis scoring and status

import { SEOAnalysisResult } from "../components/dashboard/analysis/AnalysisDetails";

export interface ScoreStatus {
  category: 'good' | 'moderate' | 'poor';
  percentage: number;
  colorClass: string;
  bgClass: string;
}

export const calculateOverallScore = (analysis: SEOAnalysisResult): number => {
  const scores: number[] = [];

  // On-page scores
  if (analysis.on_page) {
    const { links, title, score, images, headings, metaDescription, openGraph, twitterCard } = analysis.on_page;

    if (score !== undefined) scores.push(score);
    else {
      if (links?.score !== undefined) scores.push(links.score);
      if (title?.score !== undefined) scores.push(title.score);
      if (images?.score !== undefined) scores.push(images.score);
      if (headings?.score !== undefined) scores.push(headings.score);
      if (metaDescription?.score !== undefined) scores.push(metaDescription.score);
      if (openGraph?.score !== undefined) scores.push(openGraph.score);
      if (twitterCard?.score !== undefined) scores.push(twitterCard.score);
    }
  }

  // Content scores
  if (analysis.content) {
    const { score, contentQuality, readabilityScore } = analysis.content;

    if (score !== undefined) scores.push(score)
    else {
      if (contentQuality?.score !== undefined) scores.push(contentQuality.score);
      if (readabilityScore !== undefined) scores.push(readabilityScore);
    }
  }

  // Technical scores
  if (analysis.technical) {
    const { score } = analysis.technical;

    if (score !== undefined) scores.push(score);
  }

  if (scores.length === 0) return 0;

  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  return Math.round(totalScore / scores.length);
};

/**
 * Get score breakdown for categories
 */
export const getScoreBreakdown = (analysis: SEOAnalysisResult) => {
  const onPageScores: number[] = [];
  const contentScores: number[] = [];
  const technicalScores: number[] = [];

  // On-page scores
  if (analysis.on_page) {
    const { links, title, score, images, headings, metaDescription, openGraph, twitterCard } = analysis.on_page;

    if (score !== undefined) {
      onPageScores.push(score); 
    } else {
      if (links?.score !== undefined) onPageScores.push(links.score);
      if (title?.score !== undefined) onPageScores.push(title.score);
      if (images?.score !== undefined) onPageScores.push(images.score);
      if (headings?.score !== undefined) onPageScores.push(headings.score);
      if (metaDescription?.score !== undefined) onPageScores.push(metaDescription.score);
      if (openGraph?.score !== undefined) onPageScores.push(openGraph.score);
      if (twitterCard?.score !== undefined) onPageScores.push(twitterCard.score);
    }
  }

  // Content scores
  if (analysis.content) {
    const { score, contentQuality, readabilityScore } = analysis.content;
    if (score !== undefined) contentScores.push(score)
    else {
      if (contentQuality?.score !== undefined) contentScores.push(contentQuality.score);
      if (readabilityScore !== undefined) contentScores.push(readabilityScore);
    }
  }

  // Technical scores
  if (analysis.technical) {
    const { score } = analysis.technical;
    if (score !== undefined) technicalScores.push(score);
    
  }

  const onPageAvg: number =
    onPageScores.length > 0 ? Math.round(onPageScores.reduce((a, b) => a + b, 0) / onPageScores.length) : 0;
  const contentAvg: number =
    contentScores.length > 0 ? Math.round(contentScores.reduce((a, b) => a + b, 0) / contentScores.length) : 0;
  const technicalAvg: number =
    technicalScores.length > 0 ? Math.round(technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length) : 0;

  return {
    onPage: onPageAvg,
    content: contentAvg,
    technical: technicalAvg,
    overall: calculateOverallScore(analysis)
  };
};

export const getScoreStatus = (score: number): ScoreStatus => {
  const percentage = Math.round(score);

  if (score >= 70) {
    return {
      category: 'good',
      percentage,
      colorClass: 'text-green-600',
      bgClass: 'bg-green-100'
    };
  }

  if (score >= 40) {
    return {
      category: 'moderate',
      percentage,
      colorClass: 'text-yellow-600',
      bgClass: 'bg-yellow-100'
    };
  }

  return {
    category: 'poor',
    percentage,
    colorClass: 'text-red-600',
    bgClass: 'bg-red-100'
  };
};

/**
 * Get comprehensive score status using calculated overall score
 */
export const getAnalysisScoreStatus = (analysis: SEOAnalysisResult): ScoreStatus => {
  const calculatedScore = calculateOverallScore(analysis);
  return getScoreStatus(calculatedScore);
};

/**
 * Get score category only
 */
export const getScoreCategory = (score: number): 'good' | 'moderate' | 'poor' => {
  if (score >= 70) return 'good';
  if (score >= 40) return 'moderate';
  return 'poor';
};

/**
 * Get score color class only
 */
export const getScoreColor = (score: number): string => {
  if (score >= 70) return 'text-green-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

/**
 * Get score background class only
 */
export const getScoreBg = (score: number): string => {
  if (score >= 70) return 'bg-green-100 border-green-200';
  if (score >= 40) return 'bg-yellow-100 border-yellow-200';
  return 'bg-red-100 border-red-200';
};

/**
 * Calculate statistics for multiple analyses using calculated overall scores
 */
export const calculateAnalysisStats = (analyses: SEOAnalysisResult[]) => {
  const total = analyses.length;
  const good = analyses.filter(a => getScoreCategory(calculateOverallScore(a)) === 'good').length;
  const moderate = analyses.filter(a => getScoreCategory(calculateOverallScore(a)) === 'moderate').length;
  const poor = analyses.filter(a => getScoreCategory(calculateOverallScore(a)) === 'poor').length;

  return { total, good, moderate, poor };
};
