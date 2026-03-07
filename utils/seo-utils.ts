// Utility functions for SEO Analysis scoring and status

import { SEOAnalysisResult } from "../components/dashboard/analysis/AnalysisDetails";

export interface ScoreStatus {
  category: 'good' | 'moderate' | 'poor';
  percentage: number;
  colorClass: string;
  bgClass: string;
}

function toNumber(value: unknown): number | null {
  if (value == null) return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export const calculateOverallScore = (analysis: SEOAnalysisResult): number => {
  const scores: number[] = [];

  if (analysis?.on_page) {
    const { links, title, score, images, headings, metaDescription, openGraph, twitterCard } = analysis.on_page;
    const s = toNumber(score);
    if (s != null) scores.push(s);
    else {
      [links?.score, title?.score, images?.score, headings?.score, metaDescription?.score, openGraph?.score, twitterCard?.score]
        .forEach((v) => { const n = toNumber(v); if (n != null) scores.push(n); });
    }
  }

  if (analysis?.content) {
    const { score, contentQuality, readabilityScore } = analysis.content;
    const s = toNumber(score);
    if (s != null) scores.push(s);
    else {
      [contentQuality?.score, readabilityScore].forEach((v) => { const n = toNumber(v); if (n != null) scores.push(n); });
    }
  }

  if (analysis?.technical) {
    const n = toNumber(analysis.technical.score);
    if (n != null) scores.push(n);
  }

  if (scores.length === 0) return 0;
  const totalScore = scores.reduce((sum, sc) => sum + sc, 0);
  return Math.round(totalScore / scores.length);
};


export const getScoreBreakdown = (analysis: SEOAnalysisResult) => {
  const onPageScores: number[] = [];
  const contentScores: number[] = [];
  const technicalScores: number[] = [];

  if (analysis?.on_page) {
    const { links, title, score, images, headings, metaDescription, openGraph, twitterCard } = analysis.on_page;
    const s = toNumber(score);
    if (s != null) onPageScores.push(s);
    else {
      [links?.score, title?.score, images?.score, headings?.score, metaDescription?.score, openGraph?.score, twitterCard?.score]
        .forEach((v) => { const n = toNumber(v); if (n != null) onPageScores.push(n); });
    }
  }

  if (analysis?.content) {
    const { score, contentQuality, readabilityScore } = analysis.content;
    const s = toNumber(score);
    if (s != null) contentScores.push(s);
    else {
      [contentQuality?.score, readabilityScore].forEach((v) => { const n = toNumber(v); if (n != null) contentScores.push(n); });
    }
  }

  if (analysis?.technical) {
    const n = toNumber(analysis.technical.score);
    if (n != null) technicalScores.push(n);
  }

  const onPageAvg =
    onPageScores.length > 0 ? Math.round(onPageScores.reduce((a, b) => a + b, 0) / onPageScores.length) : 0;
  const contentAvg =
    contentScores.length > 0 ? Math.round(contentScores.reduce((a, b) => a + b, 0) / contentScores.length) : 0;
  const technicalAvg =
    technicalScores.length > 0 ? Math.round(technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length) : 0;

  return {
    onPage: onPageAvg,
    content: contentAvg,
    technical: technicalAvg,
    overall: calculateOverallScore(analysis),
  };
};

export const getScoreStatus = (score: number): ScoreStatus => {
  const num = typeof score === "number" && Number.isFinite(score) ? score : 0;
  const percentage = Math.round(num);

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
    category: "poor",
    percentage,
    colorClass: "text-red-600",
    bgClass: "bg-red-100",
  };
};


export const getAnalysisScoreStatus = (analysis: SEOAnalysisResult): ScoreStatus => {
  const calculatedScore = calculateOverallScore(analysis);
  return getScoreStatus(calculatedScore);
};


export const getScoreCategory = (score: number): 'good' | 'moderate' | 'poor' => {
  if (score >= 70) return 'good';
  if (score >= 40) return 'moderate';
  return 'poor';
};


export const getScoreColor = (score: number): string => {
  if (score >= 70) return 'text-green-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};


export const getScoreBg = (score: number): string => {
  if (score >= 70) return 'bg-green-100 border-green-200';
  if (score >= 40) return 'bg-yellow-100 border-yellow-200';
  return 'bg-red-100 border-red-200';
};


export const calculateAnalysisStats = (analyses: SEOAnalysisResult[]) => {
  const total = analyses.length;
  const good = analyses.filter(a => getScoreCategory(calculateOverallScore(a)) === 'good').length;
  const moderate = analyses.filter(a => getScoreCategory(calculateOverallScore(a)) === 'moderate').length;
  const poor = analyses.filter(a => getScoreCategory(calculateOverallScore(a)) === 'poor').length;

  return { total, good, moderate, poor };
};
